import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FilterForm {
  @Prop({ default: 'onChange' }) submitMode: string;
  @Prop({ type: Array, default: [] }) fields: any[];
  @Prop({ type: Object }) style?: any;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type FilterFormDocument = FilterForm & Document;
export const FilterFormSchema = SchemaFactory.createForClass(FilterForm);
FilterFormSchema.index({ status: 1 });
