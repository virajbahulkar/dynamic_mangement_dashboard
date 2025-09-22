import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransformStep } from '../../meta/transform-steps';

@Schema({ timestamps: true })
export class TransformPipeline {
  @Prop({ required: true }) name: string;
  // Steps now conceptually a discriminated union, but we retain 'any' allowance for legacy ops.
  @Prop({ type: Array, default: [] }) steps: (TransformStep | any)[];
  @Prop({ type: Types.ObjectId }) previousVersionRef?: Types.ObjectId;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active | draft | archived
  @Prop({ type: String }) planHash?: string; // optional hash of normalized pipeline for caching (future use)
}

export type TransformPipelineDocument = TransformPipeline & Document;
export const TransformPipelineSchema = SchemaFactory.createForClass(TransformPipeline);

// Indexes
TransformPipelineSchema.index({ name: 1, status: 1, version: -1 });
TransformPipelineSchema.index({ name: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
TransformPipelineSchema.index({ planHash: 1 });
