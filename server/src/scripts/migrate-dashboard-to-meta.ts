import 'dotenv/config';
import mongoose, { Model, Types } from 'mongoose';
import { DashboardConfigSchema } from '../modules/dashboard-config.schema';
import { ApplicationSchema } from '../modules/meta/schemas/application.schema';
import { PageSchema } from '../modules/meta/schemas/page.schema';
import { LayoutSchema } from '../modules/meta/schemas/layout.schema';
import { ComponentSchema } from '../modules/meta/schemas/component.schema';
import { DataSourceSchema } from '../modules/meta/schemas/data-source.schema';
import { TransformPipelineSchema } from '../modules/meta/schemas/transform-pipeline.schema';

/*
 * Migration goals:
 * 1. Find existing DashboardConfig document that represents the management dashboard page layout (kind='layout' or name includes 'page-layout').
 * 2. Create (or upsert) Application document for appId derived from doc.appId (default -> name 'Default App').
 * 3. Create Layout document capturing the tab/row/column structure (structure stored under data.template.layout or similar).
 * 4. For each quadrant/component inside the layout's template content, create ComponentDef (+ DataSource / TransformPipeline if present).
 * 5. Create Page document tying layout + components via slot paths (e.g., tabIndex:quadrantIndex) and slug from doc.pageSlug or derived name.
 * 6. Do not delete legacy DashboardConfig; optionally tag it with status='migrated'.
 */

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri);

  const DashboardConfigModel: Model<any> = mongoose.models.DashboardConfig || mongoose.model('DashboardConfig', DashboardConfigSchema, 'dashboardconfigs');
  const ApplicationModel: Model<any> = mongoose.models.Application || mongoose.model('Application', ApplicationSchema, 'applications');
  const PageModel: Model<any> = mongoose.models.Page || mongoose.model('Page', PageSchema, 'pages');
  const LayoutModel: Model<any> = mongoose.models.Layout || mongoose.model('Layout', LayoutSchema, 'layouts');
  const ComponentModel: Model<any> = mongoose.models.ComponentDef || mongoose.model('ComponentDef', ComponentSchema, 'components');
  const DataSourceModel: Model<any> = mongoose.models.DataSource || mongoose.model('DataSource', DataSourceSchema, 'datasources');
  const TransformPipelineModel: Model<any> = mongoose.models.TransformPipeline || mongoose.model('TransformPipeline', TransformPipelineSchema, 'transformpipelines');

  // 1. Identify candidate page layout config
  const layoutDoc = await DashboardConfigModel.findOne({ type: 'page-layout', kind: 'page', status: { $in: ['active', 'migrated'] } });
  if (!layoutDoc) {
    console.log('No layout DashboardConfig document found; nothing to migrate.');
    await mongoose.disconnect();
    return;
  }

  const appId: string = layoutDoc.appId || 'default';
  const derivedSlug = (() => {
    if (layoutDoc.pageSlug) return layoutDoc.pageSlug;
    // Derive from name: remove -page-v* suffix patterns
    const nm: string = layoutDoc.name || 'management-dashboard';
    return nm.replace(/-page-v\d+$/i, '').replace(/-v\d+$/i, '').replace(/_page_\d+$/i, '');
  })();
  const pageSlug: string = derivedSlug || 'management-dashboard';
  const raw = layoutDoc.data || {};
  const tabs = raw.tabs || [];

  // 2. Upsert Application
  let app = await ApplicationModel.findOne({ appId, status: 'active' });
  if (!app) {
    app = await ApplicationModel.create({ appId, name: appId === 'default' ? 'Default App' : appId, navigation: null });
    console.log('Created Application', appId);
  }

  // 3. Build layout structure (strip heavy component details, retain slots only)
  const layoutStructure = {
    type: 'tabbed-grid',
    tabs: tabs.map((t: any, tIdx: number) => ({
      title: t.title || `Tab ${tIdx + 1}`,
      rows: (t.rows || []).map((r: any, rIdx: number) => ({
        quadrants: (r.quadrants || []).map((q: any, qIdx: number) => ({
          slot: `${tIdx}:${rIdx}:${qIdx}`,
          span: q.span || 1,
        })),
      }))
    })),
  };

  // Check if layout already exists with identical signature (hash by JSON length + tab count)
  const existingLayout = await LayoutModel.findOne({ 'structure.tabs.length': layoutStructure.tabs.length });
  const layout = existingLayout || await LayoutModel.create({ type: 'tabbed-grid', structure: layoutStructure });
  if (!existingLayout) console.log('Created Layout');

  // 4. Create components + data sources
  const componentRefs: { ref: Types.ObjectId; slotPath: string }[] = [];
  for (let tIdx = 0; tIdx < tabs.length; tIdx++) {
    const tab = tabs[tIdx];
    const rows = tab?.rows || [];
    for (let rIdx = 0; rIdx < rows.length; rIdx++) {
      const row = rows[rIdx];
      const quadrants = row?.quadrants || [];
      for (let qIdx = 0; qIdx < quadrants.length; qIdx++) {
        const quad = quadrants[qIdx];
        if (!quad) continue;
        const slotPath = `${tIdx}:${rIdx}:${qIdx}`;
        const { dataSource, transform, componentType, title } = quad;

      let dsRef: Types.ObjectId | undefined;
      if (dataSource && dataSource.type) {
        const ds = await DataSourceModel.create({
          type: dataSource.type,
          method: dataSource.method,
          url: dataSource.endpoint || dataSource.url,
          baseUrl: dataSource.baseUrl,
          pollingMs: dataSource.pollingMs || dataSource.polling?.ms,
        });
        dsRef = ds._id;
      }

      let tpRef: Types.ObjectId | undefined;
      if (transform && Array.isArray(transform.steps)) {
        const tp = await TransformPipelineModel.create({ steps: transform.steps });
        tpRef = tp._id;
      }

        const comp = await ComponentModel.create({
          kind: quad.type || quad.kind || componentType || 'generic',
          title: title || quad.title,
          dataSourceRef: dsRef,
          transformPipelineRef: tpRef,
          props: quad.props || quad.options || quad.config || {},
          style: quad.style || {},
          interactions: quad.interactions || {},
        });
  componentRefs.push({ ref: comp._id, slotPath });
      }
    }
  }

  // 5. Upsert Page
  let page = await PageModel.findOne({ appId, slug: pageSlug, status: 'active' });
  if (!page) {
  page = await PageModel.create({ appId, slug: pageSlug, title: raw.title || 'Management Dashboard', layoutRef: layout._id, components: componentRefs });
    console.log('Created Page', pageSlug);
  } else if (!page.layoutRef) {
    page.layoutRef = layout._id;
    page.components = componentRefs;
    await page.save();
    console.log('Updated Page with layout/components');
  }

  // 6. Tag legacy doc
  if (layoutDoc.status !== 'migrated') {
    layoutDoc.status = 'migrated';
    await layoutDoc.save();
    console.log('Tagged legacy DashboardConfig as migrated');
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
