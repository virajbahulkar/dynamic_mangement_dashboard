import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DataSource {
  @Prop({ required: true }) type: string; // rest | socket | graphql etc.
  @Prop() method?: string;
  @Prop() url?: string;
  @Prop() baseUrl?: string;
  @Prop({ type: Object }) auth?: any;
  @Prop({ type: Object }) queryParamBindings?: any;
  @Prop({ type: Number }) pollingMs?: number;
  @Prop({ type: Object }) cache?: any;
  @Prop({ type: Array }) sampleData?: any[];
  @Prop({ type: String }) sampleHash?: string; // SHA256 of canonical sampleData for cache invalidation
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type DataSourceDocument = DataSource & Document;
export const DataSourceSchema = SchemaFactory.createForClass(DataSource);
DataSourceSchema.index({ type: 1, url: 1, status: 1 });

// Compute sampleHash before save if sampleData changed
import { createHash } from 'crypto';
function canonicalize(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return '[' + value.map(v => canonicalize(v)).join(',') + ']';
  if (typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
  }
  return JSON.stringify(value);
}
DataSourceSchema.pre('save', function(next) {
  try {
    // @ts-ignore
    if (this.isModified('sampleData')) {
      // @ts-ignore
      const canon = canonicalize(this.sampleData);
      // @ts-ignore
      this.sampleHash = createHash('sha256').update(canon).digest('hex');
    }
  } catch (e) { /* swallow hashing errors */ }
  next();
});
