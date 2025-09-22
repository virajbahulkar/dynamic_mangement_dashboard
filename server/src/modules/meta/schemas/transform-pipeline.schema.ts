import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TransformPipeline {
  @Prop({ required: true }) name: string;
  @Prop({ type: Array, default: [] }) steps: any[]; // array of transform step objects
  @Prop({ type: Types.ObjectId }) previousVersionRef?: Types.ObjectId;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active | draft | archived
}

export type TransformPipelineDocument = TransformPipeline & Document;
export const TransformPipelineSchema = SchemaFactory.createForClass(TransformPipeline);

// Indexes
TransformPipelineSchema.index({ name: 1, status: 1, version: -1 });
TransformPipelineSchema.index({ name: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
