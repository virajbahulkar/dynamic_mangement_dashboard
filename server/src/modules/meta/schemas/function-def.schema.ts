import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FunctionDef {
  @Prop({ required: true }) name: string; // unique active name
  @Prop({ required: true }) runtime: string; // js | wasm (future)
  @Prop({ required: true }) code: string;
  @Prop({ required: true }) codeHash: string; // SHA256 of code for integrity
  @Prop({ type: Object }) inputSchema?: any; // JSON Schema
  @Prop({ type: Object }) outputSchema?: any; // JSON Schema
  @Prop({ type: Object }) limits?: { timeoutMs?: number; maxMemoryMb?: number };
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active | draft | archived
}

export type FunctionDefDocument = FunctionDef & Document;
export const FunctionDefSchema = SchemaFactory.createForClass(FunctionDef);
FunctionDefSchema.index({ name: 1, status: 1, version: -1 });
FunctionDefSchema.index({ name: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
