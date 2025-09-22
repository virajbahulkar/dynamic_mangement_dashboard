import { connect, model, models } from 'mongoose';
import 'dotenv/config';
import { Application, ApplicationSchema } from '../modules/meta/schemas/application.schema';
import { Page, PageSchema } from '../modules/meta/schemas/page.schema';
import { Layout, LayoutSchema } from '../modules/meta/schemas/layout.schema';
import { ComponentDef, ComponentSchema } from '../modules/meta/schemas/component.schema';
import { DataSource, DataSourceSchema } from '../modules/meta/schemas/data-source.schema';
import { TransformPipeline, TransformPipelineSchema } from '../modules/meta/schemas/transform-pipeline.schema';
import { ConfigItem, ConfigItemSchema } from '../modules/meta/schemas/config-item.schema';
// Script environment may not include @types/node; declare minimal process type
declare const process: any;
declare function require(name: string): any;

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://root:root@mongo:27017/dashboard?authSource=admin';
  await connect(uri);
  // Register schemas explicitly (idempotent: reuse existing models if present)
  const App = (models[Application.name] as any) || model(Application.name, ApplicationSchema);
  const Pg = (models[Page.name] as any) || model(Page.name, PageSchema);
  const Lay = (models[Layout.name] as any) || model(Layout.name, LayoutSchema);
  // Use explicit 'components' collection to align with MetaModule registration.
  const Comp = (models[ComponentDef.name] as any) || model(ComponentDef.name, ComponentSchema, 'components');

  // One-time migration: if 'components' is empty but legacy 'componentdefs' exists, copy documents over.
  // Use require to avoid needing type declarations in this script-only context
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mongooseAny: any = require('mongoose');
  const existingComponentsCount = await Comp.countDocuments();
  if (existingComponentsCount === 0 && mongooseAny.connection.collections['componentdefs']) {
    const legacyDocs = await mongooseAny.connection.collections['componentdefs'].find({}).toArray();
    if (legacyDocs.length) {
      // Strip _id to allow fresh insertion (or reuse same _id to preserve refs)
      for (const d of legacyDocs) {
        const {_id, ...rest} = d;
        // Preserve original _id so page.component refs remain valid
        await Comp.collection.insertOne({ _id, ...rest });
      }
      console.log(`Migrated ${legacyDocs.length} legacy componentdefs -> components`);
    }
  }
  const DS = (models[DataSource.name] as any) || model(DataSource.name, DataSourceSchema);
  const TP = (models[TransformPipeline.name] as any) || model(TransformPipeline.name, TransformPipelineSchema);
  const CI = (models[ConfigItem.name] as any) || model(ConfigItem.name, ConfigItemSchema);

  const appId = 'default';
  const slug = 'management-dashboard';
  let page = await Pg.findOne({ appId, slug, status: 'active' });
  if (!page) {
    // Create minimal application if missing
    let app = await App.findOne({ appId, status: 'active' });
    if (!app) {
      app = await App.create({ appId, name: 'Default App', status: 'active' } as any);
      console.log('Created Application fallback');
    }
    // Create a trivial single-tab, single-row, two-quadrant layout to host sample components
    const existingLayout = await Lay.findOne({ 'structure.type': 'seed-single' });
    const layout = existingLayout || await Lay.create({
      type: 'tabbed-grid',
      structure: {
        type: 'seed-single',
        tabs: [
          {
            title: 'Overview',
            rows: [
              { quadrants: [ { slot: '0:0:0', span: 1 }, { slot: '0:0:1', span: 1 } ] }
            ]
          }
        ]
      }
    } as any);
    if (!existingLayout) console.log('Created fallback Layout');
    page = await Pg.create({ appId, slug, title: 'Management Dashboard', layoutRef: layout._id, components: [], status: 'active' } as any);
    console.log('Created fallback Page');
  }

  // Create or reuse sample DataSource with embedded sampleData for transform demonstration
  const sampleDs = await DS.findOne({ name: 'sample-issuance-ds', status: 'active' }) || await DS.create({
    name: 'sample-issuance-ds',
    type: 'inline',
    // @ts-ignore allow sampleData passthrough though schema does not declare explicitly
    sampleData: [
      { channel: 'DIGITAL', value: 120, region: 'NA' },
      { channel: 'AGENT', value: 80, region: 'EU' },
      { channel: 'BRANCH', value: 55, region: 'NA' },
      { channel: 'DIGITAL', value: 200, region: 'APAC' }
    ],
    status: 'active'
  } as any);

  const pipeline = await TP.findOne({ name: 'top-digital-only', status: 'active' }) || await TP.create({
    name: 'top-digital-only',
    steps: [
      { op: 'filter', expr: { channel: 'DIGITAL' } },
      { op: 'limit', count: 2 },
      { op: 'pickFields', fields: ['channel', 'value'] }
    ],
    status: 'active'
  });
  // Upsert (or recreate) demo components ensuring actual docs exist even if page has stale refs
  const desired = [
    { kind: 'table', title: 'Top Digital Entries', slotPath: '0:0:0', props: { columns: ['channel', 'value'] } },
    { kind: 'chart', title: 'Digital Distribution', slotPath: '0:0:1', props: { xField: 'channel', yField: 'value', type: 'bar' } }
  ];
  const freshRefs: { ref: any; slotPath: string }[] = [];
  for (const d of desired) {
    let compDoc = await Comp.findOne({ title: d.title, kind: d.kind, status: 'active' });
    if (!compDoc) {
      compDoc = await Comp.create({
        kind: d.kind,
        title: d.title,
        dataSourceRef: sampleDs._id,
        transformPipelineRef: pipeline._id,
        props: d.props,
        status: 'active'
      });
      console.log('Created component', d.title);
    }
    freshRefs.push({ ref: compDoc._id, slotPath: d.slotPath });
  }
  // Replace page.components if mismatch or missing docs
  const existingCompIds = await Comp.find({ _id: { $in: (page.components || []).map(c => c.ref) } }, { _id: 1 }).lean();
  if ((page.components || []).length !== desired.length || existingCompIds.length !== desired.length) {
    await Pg.updateOne({ _id: page._id }, { $set: { components: freshRefs } });
    console.log('Reset page.components with fresh component references');
  } else {
    console.log('Page component references are intact');
  }

  console.log('Seed complete.');
  // Seed config items (idempotent via unique active index)
  const themeColors = [
    { key: 'blue-theme', value: { color: '#3881B5' } },
    { key: 'green-theme', value: { color: '#03C9D7' } },
    { key: 'purple-theme', value: { color: '#7352FF' } },
    { key: 'red-theme', value: { color: '#FF5C8E' } },
    { key: 'indigo-theme', value: { color: '#1E4DB7' } },
    { key: 'orange-theme', value: { color: '#FB9678' } }
  ];
  for (const c of themeColors) {
    await CI.updateOne({ appId, category: 'themeColors', key: c.key, status: 'active' }, { $setOnInsert: { value: c.value } }, { upsert: true });
  }

  const axisConfigs = [
    { key: 'bar-primary', value: { valueType: 'Category', majorGridLines: { width: 0 } } },
    { key: 'stacked-primary', value: { valueType: 'Category', labelIntersectAction: 'Rotate45' } }
  ];
  for (const a of axisConfigs) {
    await CI.updateOne({ appId, category: 'axisConfig', key: a.key, status: 'active' }, { $setOnInsert: { value: a.value } }, { upsert: true });
  }

  const formDef = {
    fields: [
      { name: 'channel', type: 'select', options: ['DIGITAL','AGENT','BRANCH'], default: 'DIGITAL' },
      { name: 'yoy', type: 'select', options: ['2023','2024'], default: '2023' }
    ]
  };
  await CI.updateOne({ appId, category: 'formDefinition', key: 'default-filters', status: 'active' }, { $setOnInsert: { value: formDef } }, { upsert: true });
  console.log('Config items seeded.');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
