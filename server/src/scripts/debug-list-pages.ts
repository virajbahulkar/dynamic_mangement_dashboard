import 'dotenv/config';
import mongoose from 'mongoose';
import { PageSchema } from '../modules/meta/schemas/page.schema';

// Minimal declarations to avoid needing full @types/node in this isolated script context for build tooling.
// (The project already installs @types/node; this is defensive.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);
  const PageModel: any = mongoose.models.Page || mongoose.model('Page', PageSchema, 'pages');
  const docs = await PageModel.find({});
  const pages = docs.map(d => ({
    _id: d._id,
    appId: (d as any).appId,
    slug: (d as any).slug,
    status: (d as any).status,
    version: (d as any).version,
    layoutRef: (d as any).layoutRef,
    components: (d as any).components,
    createdAt: (d as any).createdAt,
    updatedAt: (d as any).updatedAt
  }));
  console.log(JSON.stringify(pages, null, 2));
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
