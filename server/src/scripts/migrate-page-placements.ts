import { connect, model, models, Types } from 'mongoose';
import 'dotenv/config';
import { Page, PageSchema } from '../modules/meta/schemas/page.schema';
import { ComponentDef, ComponentSchema } from '../modules/meta/schemas/component.schema';
import { Asset, AssetSchema } from '../modules/meta/schemas/asset.schema';

// Minimal migration: create an Asset per component (if none exists with same primaryComponentRef) and add placements mirroring components[]
// Idempotent: safe to re-run.

declare const process: any;

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URI || 'mongodb://root:root@mongo:27017/dashboard?authSource=admin';
  await connect(uri);
  const Pg = (models[Page.name] as any) || model(Page.name, PageSchema);
  const Comp = (models[ComponentDef.name] as any) || model(ComponentDef.name, ComponentSchema, 'components');
  const Ast = (models[Asset.name] as any) || model(Asset.name, AssetSchema);

  const pages = await Pg.find({ status: 'active' });
  for (const p of pages) {
    const comps: { ref: Types.ObjectId; slotPath: string }[] = p.components || [];
    if (!comps.length) continue;
    const placementsExisting = Array.isArray(p.placements) && p.placements.length > 0;
    if (placementsExisting) continue; // already migrated
    const placements: { assetRef: Types.ObjectId; slotPath: string }[] = [];
    for (const c of comps) {
      const compDoc = await Comp.findById(c.ref);
      if (!compDoc) continue;
      let asset = await Ast.findOne({ primaryComponentRef: compDoc._id, status: 'active' });
      if (!asset) {
        asset = await Ast.create({
          type: compDoc.kind || 'component',
            name: compDoc.title || `asset-${compDoc._id.toString().slice(-6)}`,
            primaryComponentRef: compDoc._id,
            status: 'active'
        });
        // console.log created asset suppressed for cleaner output
      }
      placements.push({ assetRef: asset._id, slotPath: c.slotPath });
    }
    if (placements.length) {
      await Pg.updateOne({ _id: p._id }, { $set: { placements } });
      console.log(`Page ${p.slug}: added ${placements.length} placements`);
    }
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
