import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true }) appId: string;
  @Prop({ required: true }) slug: string;
  @Prop() title?: string;
  @Prop({ type: Types.ObjectId }) layoutRef?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) filterFormRef?: Types.ObjectId;
  @Prop({ type: Array, default: [] }) components?: { ref: Types.ObjectId; slotPath: string }[];
  // New placement model (future) referencing Assets instead of raw components
  @Prop({ type: Array, default: [] }) placements?: { assetRef: Types.ObjectId; slotPath: string; overrides?: any }[];
  @Prop({ type: Array, default: [] }) tags?: string[];
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
// Query newest version of a page by app+slug quickly
PageSchema.index({ appId: 1, slug: 1, status: 1, version: -1 });
// Ensure only one active version per app+slug
PageSchema.index({ appId: 1, slug: 1, status: 1 }, { partialFilterExpression: { status: 'active' }, unique: true });
// Support listing pages by app and tag filtering
PageSchema.index({ appId: 1, 'tags': 1 });

