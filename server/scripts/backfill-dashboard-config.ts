import 'dotenv/config';
import mongoose from 'mongoose';
import { DashboardConfigSchema, DashboardConfig } from '../src/modules/dashboard-config.schema';

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri);
  const Model = mongoose.model<DashboardConfig & mongoose.Document>('DashboardConfig', DashboardConfigSchema, 'dashboardconfigs');
  const docs = await Model.find();
  let modified = 0;
  for (const doc of docs) {
    let changed = false;
    if (doc.get('appId') == null) { doc.set('appId', 'default'); changed = true; }
    if (doc.get('kind') == null) { doc.set('kind', 'component'); changed = true; }
    if (doc.get('version') == null) { doc.set('version', 1); changed = true; }
    if (doc.get('status') == null) { doc.set('status', 'active'); changed = true; }
    if (changed) { await doc.save(); modified++; }
  }
  console.log(`Backfill complete. Modified ${modified} of ${docs.length}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
