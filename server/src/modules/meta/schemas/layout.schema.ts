import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Layout {
  @Prop({ required: true }) type: string; // e.g., tabbed-grid
  @Prop({ type: Object }) structure: any; // tabs/rows/columns tree
  @Prop({ type: Object }) responsive?: any;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type LayoutDocument = Layout & Document;
export const LayoutSchema = SchemaFactory.createForClass(Layout);
LayoutSchema.index({ type: 1, status: 1 });
// Latest active layout per type
LayoutSchema.index({ type: 1, status: 1, version: -1 });

