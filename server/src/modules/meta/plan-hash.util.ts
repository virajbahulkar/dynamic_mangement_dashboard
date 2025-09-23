// Use dynamic require to avoid type resolution dependency on @types/node
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createHash } = require('crypto');

function canonicalize(value: any): any {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(v => canonicalize(v));
  const keys = Object.keys(value).filter(k => value[k] !== undefined).sort();
  const out: any = {};
  for (const k of keys) out[k] = canonicalize(value[k]);
  return out;
}

export function computePlanHash(steps: any[]): string {
  const canonical = canonicalize(steps || []);
  const json = JSON.stringify(canonical);
  return createHash('sha256').update(json, 'utf8').digest('hex');
}
