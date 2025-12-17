import { connect, model, models } from 'mongoose';
import 'dotenv/config';
import { TransformPipeline, TransformPipelineSchema } from '../modules/meta/schemas/transform-pipeline.schema';
import { computePlanHash } from '../modules/meta/plan-hash.util';

// Minimal process typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://root:root@mongo:27017/dashboard?authSource=admin';
  await connect(uri);
  const TP = (models[TransformPipeline.name] as any) || model(TransformPipeline.name, TransformPipelineSchema);
  const cursor = TP.find({ $or: [ { planHash: { $exists: false } }, { planHash: null } ] }).cursor();
  let updated = 0; let scanned = 0;
  for await (const doc of cursor) {
    scanned++;
    const hash = computePlanHash(doc.steps || []);
    if (doc.planHash !== hash) {
      doc.planHash = hash;
      await doc.save();
      updated++;
    }
  }
  console.log(`Backfill complete. Scanned=${scanned} Updated=${updated}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
