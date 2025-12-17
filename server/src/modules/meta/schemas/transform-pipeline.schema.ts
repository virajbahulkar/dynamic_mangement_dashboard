import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransformStep, validateTransformSteps } from '../../meta/transform-steps';
import { computePlanHash } from '../../meta/plan-hash.util';

@Schema({ timestamps: true })
export class TransformPipeline {
  @Prop({ required: true }) name: string;
  // Steps now conceptually a discriminated union, but we retain 'any' allowance for legacy ops.
  @Prop({ type: Array, default: [] }) steps: (TransformStep | any)[];
  @Prop({ type: Types.ObjectId }) previousVersionRef?: Types.ObjectId;
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active | draft | archived
  @Prop({ type: String }) planHash?: string; // optional hash of normalized pipeline for caching (future use)
  @Prop({ type: Array, default: [] }) warnings?: string[]; // validation warnings (legacy steps etc.)
}

export type TransformPipelineDocument = TransformPipeline & Document;
export const TransformPipelineSchema = SchemaFactory.createForClass(TransformPipeline);

// Indexes
TransformPipelineSchema.index({ name: 1, status: 1, version: -1 });
TransformPipelineSchema.index({ name: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
TransformPipelineSchema.index({ planHash: 1 });

// Pre-validate & pre-save hooks: validate steps, set warnings, compute planHash
TransformPipelineSchema.pre('save', function(next) {
  try {
    if (this.isModified('steps')) {
      const result = validateTransformSteps(this.steps || []);
      // invalid steps block save
      if (result.invalid && result.invalid.length) {
        return next(new Error('Invalid transform steps: ' + result.invalid.map(i => `${i.index}:${i.reason}`).join(',')));
      }
      // store warnings for legacy steps
      this.warnings = [];
      if (result.legacy && result.legacy.length) {
        this.warnings.push(`legacySteps:${result.legacy.length}`);
      }
    }
    if (this.isModified('steps') || !this.planHash) {
      this.planHash = computePlanHash(this.steps || []);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

