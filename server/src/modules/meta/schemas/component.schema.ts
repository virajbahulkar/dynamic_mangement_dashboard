import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ComponentDef {
  @Prop({ required: true }) kind: string; // table | chart | metric | html ...
  @Prop() title?: string;
  @Prop({ type: Types.ObjectId }) dataSourceRef?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) transformPipelineRef?: Types.ObjectId;
  @Prop({ type: Object }) props?: any;
  @Prop({ type: Object }) interactions?: any;
  @Prop({ type: Object }) style?: any;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}
export type ComponentDocument = ComponentDef & Document;
export const ComponentSchema = SchemaFactory.createForClass(ComponentDef);
ComponentSchema.index({ kind: 1, status: 1 });
// Fast lookup by data source linkage
ComponentSchema.index({ dataSourceRef: 1, status: 1 });
// Versioned active component uniqueness per dataSource (optional uniqueness constraint on active ones)
ComponentSchema.index({ dataSourceRef: 1, kind: 1, status: 1, version: -1 });

