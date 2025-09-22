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
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type DataSourceDocument = DataSource & Document;
export const DataSourceSchema = SchemaFactory.createForClass(DataSource);
DataSourceSchema.index({ type: 1, url: 1, status: 1 });
