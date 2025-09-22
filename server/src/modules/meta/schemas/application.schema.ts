import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true }) appId: string;
  @Prop({ required: true }) name: string;
  @Prop({ type: Object }) branding?: any;
  @Prop({ type: Object }) navigation?: any; // sidebar/navbar structure
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string;
}

export type ApplicationDocument = Application & Document;
export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ appId: 1, status: 1, version: -1 });
ApplicationSchema.index({ appId: 1, status: 1 }, { partialFilterExpression: { status: 'active' } });
