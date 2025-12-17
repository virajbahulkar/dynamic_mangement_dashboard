import { connect, model, models } from 'mongoose';
import 'dotenv/config';
import { Application, ApplicationSchema } from '../modules/meta/schemas/application.schema';
import { Page, PageSchema } from '../modules/meta/schemas/page.schema';
import { Layout, LayoutSchema } from '../modules/meta/schemas/layout.schema';
import { ComponentDef, ComponentSchema } from '../modules/meta/schemas/component.schema';
import { DataSource, DataSourceSchema } from '../modules/meta/schemas/data-source.schema';
import { TransformPipeline, TransformPipelineSchema } from '../modules/meta/schemas/transform-pipeline.schema';
import { Asset, AssetSchema } from '../modules/meta/schemas/asset.schema';
import { FunctionDef, FunctionDefSchema } from '../modules/meta/schemas/function-def.schema';
import { ConfigItem, ConfigItemSchema } from '../modules/meta/schemas/config-item.schema';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any; // minimal for script environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function require(name: string): any;

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://root:root@mongo:27017/dashboard?authSource=admin';
  await connect(uri);
  const App = (models[Application.name] as any) || model(Application.name, ApplicationSchema);
  const Pg = (models[Page.name] as any) || model(Page.name, PageSchema);
  const Lay = (models[Layout.name] as any) || model(Layout.name, LayoutSchema);
  const Comp = (models[ComponentDef.name] as any) || model(ComponentDef.name, ComponentSchema, 'components');
  const DS = (models[DataSource.name] as any) || model(DataSource.name, DataSourceSchema);
  const TP = (models[TransformPipeline.name] as any) || model(TransformPipeline.name, TransformPipelineSchema);
  const Ast = (models[Asset.name] as any) || model(Asset.name, AssetSchema);
  const Fn = (models[FunctionDef.name] as any) || model(FunctionDef.name, FunctionDefSchema);
  const CI = (models[ConfigItem.name] as any) || model(ConfigItem.name, ConfigItemSchema);

  const appId = 'demo-sales';
  const slug = 'revenue-overview';
  let app = await App.findOne({ appId, status: 'active' });
  if (!app) {
    app = await App.create({ appId, name: 'Demo Sales App', status: 'active' } as any);
  }

  // Data Source with monthly revenue
  const salesData = [
    { region: 'NA', month: '2025-01', revenue: 120000, target: 100000 },
    { region: 'EU', month: '2025-01', revenue: 95000, target: 90000 },
    { region: 'APAC', month: '2025-01', revenue: 80000, target: 85000 },
    { region: 'NA', month: '2025-02', revenue: 130000, target: 105000 },
    { region: 'EU', month: '2025-02', revenue: 99000, target: 92000 },
    { region: 'APAC', month: '2025-02', revenue: 87000, target: 86000 },
    { region: 'NA', month: '2025-03', revenue: 140500, target: 110000 },
    { region: 'EU', month: '2025-03', revenue: 101000, target: 94000 },
    { region: 'APAC', month: '2025-03', revenue: 90200, target: 87000 }
  ];
  const latestMonth = salesData.map(r => r.month).sort().slice(-1)[0];
  const salesDs = await DS.findOne({ name: 'sales-kpis-ds', status: 'active' }) || await DS.create({
    name: 'sales-kpis-ds',
    type: 'inline',
    // @ts-ignore sampleData passthrough
    sampleData: salesData,
    status: 'active'
  } as any);

  // Pipelines
  const regionalLatest = await TP.findOne({ name: 'regional-latest', status: 'active' }) || await TP.create({
    name: 'regional-latest',
    steps: [
      { op: 'filter', expr: { month: latestMonth } }
      // TODO: once aggregate step is implemented add grouping by region
    ],
    status: 'active'
  });
  const monthlyTrend = await TP.findOne({ name: 'monthly-trend', status: 'active' }) || await TP.create({
    name: 'monthly-trend',
    steps: [
      { op: 'filter', expr: { region: 'NA' } },
      { op: 'limit', count: 12 }
    ],
    status: 'active'
  });

  // Functions
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createHash } = require('crypto');
  async function ensureFn(name: string, code: string) {
    const existing = await Fn.findOne({ name, status: 'active' });
    if (existing) return false;
    const codeHash = createHash('sha256').update(code, 'utf8').digest('hex');
    await Fn.create({ name, runtime: 'js', code, codeHash, status: 'active' });
    return true;
  }
  const newFnCreated = await ensureFn('pctToString', "module.exports=(n)=> typeof n==='number'? (n*100).toFixed(1)+'%':null;");

  // Components
  const specComponents = [
    { title: 'KPI Table', kind: 'table', pipeline: regionalLatest._id, props: { columns: ['region','revenue','target'] }, slotPath: '0:0:0' },
    { title: 'Regional Revenue', kind: 'chart', pipeline: regionalLatest._id, props: { type: 'bar', xField: 'region', yField: 'revenue' }, slotPath: '0:0:1' },
    { title: 'Monthly Trend', kind: 'chart', pipeline: monthlyTrend._id, props: { type: 'line', xField: 'month', yField: 'revenue' }, slotPath: '0:1:0' }
  ];
  const compRefs: { compId: any; slotPath: string }[] = [];
  for (const sc of specComponents) {
    let comp = await Comp.findOne({ title: sc.title, kind: sc.kind, status: 'active' });
    if (!comp) {
      comp = await Comp.create({
        title: sc.title,
        kind: sc.kind,
        dataSourceRef: salesDs._id,
        transformPipelineRef: sc.pipeline,
        props: sc.props,
        status: 'active'
      });
      console.log('Created component', sc.title);
    }
    compRefs.push({ compId: comp._id, slotPath: sc.slotPath });
  }

  // Assets (one per component)
  const assetRefs: { assetId: any; slotPath: string }[] = [];
  for (const c of compRefs) {
    const existingAsset = await Ast.findOne({ primaryComponentRef: c.compId, status: 'active' });
    if (existingAsset) {
      assetRefs.push({ assetId: existingAsset._id, slotPath: c.slotPath });
      continue;
    }
    const comp = await Comp.findById(c.compId);
    if (!comp) continue;
    const asset = await Ast.create({
      type: comp.kind || 'component',
      name: comp.title || 'Unnamed Asset',
      primaryComponentRef: comp._id,
      parameters: [ { name: 'month', type: 'string', default: latestMonth } ],
      visualizationSpec: { kind: comp.kind, title: comp.title },
      status: 'active'
    } as any);
    assetRefs.push({ assetId: asset._id, slotPath: c.slotPath });
    console.log('Created asset for component', comp.title);
  }

  // Layout (simple tabbed grid with two rows)
  const existingLayout = await Lay.findOne({ 'structure.type': 'demo-grid-1' });
  const layout = existingLayout || await Lay.create({
    type: 'tabbed-grid',
    structure: {
      type: 'demo-grid-1',
      tabs: [
        { title: 'Overview', rows: [ { quadrants: [ { slot: '0:0:0', span: 1 }, { slot: '0:0:1', span: 1 } ] }, { quadrants: [ { slot: '0:1:0', span: 2 } ] } ] }
      ]
    }
  } as any);

  let page = await Pg.findOne({ appId, slug, status: 'active' });
  if (!page) {
    page = await Pg.create({ appId, slug, title: 'Revenue Overview', layoutRef: layout._id, status: 'active', components: [], placements: [] } as any);
    console.log('Created page');
  }

  // Update placements if changed
  const desiredPlacements = assetRefs.map(a => ({ assetRef: a.assetId, slotPath: a.slotPath }));
  const needsPlacementUpdate = JSON.stringify((page.placements||[]).map(p => ({ assetRef: p.assetRef?.toString(), slotPath: p.slotPath })).sort((a,b)=>a.slotPath.localeCompare(b.slotPath))) !== JSON.stringify(desiredPlacements.map(p => ({ assetRef: p.assetRef.toString(), slotPath: p.slotPath })).sort((a,b)=>a.slotPath.localeCompare(b.slotPath)));
  if (needsPlacementUpdate) {
    await Pg.updateOne({ _id: page._id }, { $set: { placements: desiredPlacements } });
    console.log('Updated page placements');
  } else {
    console.log('Placements already up to date');
  }

  // Theme config (minimal) if missing for this app
  await CI.updateOne({ appId, category: 'themeColors', key: 'primary', status: 'active' }, { $setOnInsert: { value: { color: '#3881B5' } } }, { upsert: true });

  console.log('Demo seed complete:', {
    latestMonth,
    newFnCreated,
    components: compRefs.length,
    assets: assetRefs.length,
    placements: assetRefs.length
  });
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
