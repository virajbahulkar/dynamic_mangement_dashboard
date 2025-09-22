import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true }) type: string; // table | chart | metric | html | form
  @Prop({ required: true }) name: string;
  @Prop({ type: Types.ObjectId }) primaryComponentRef?: Types.ObjectId; // legacy component link
  @Prop({ type: Object }) visualizationSpec?: any; // normalized spec (columns, encodings, etc.)
  @Prop({ type: Array, default: [] }) parameters?: { name: string; type: string; default?: any; required?: boolean }[];
  @Prop({ type: Object }) permissions?: { read?: string[]; edit?: string[]; execute?: string[] };
  @Prop({ type: Array, default: [] }) tags?: string[];
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active | draft | archived
}

export type AssetDocument = Asset & Document;
export const AssetSchema = SchemaFactory.createForClass(Asset);
AssetSchema.index({ name: 1, status: 1, version: -1 });
// Ensure only one active version per name
AssetSchema.index({ name: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
AssetSchema.index({ type: 1, status: 1 });
