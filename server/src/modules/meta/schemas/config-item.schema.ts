import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ConfigItem {
  @Prop({ required: true }) appId: string; // scope (could be 'global')
  @Prop({ required: true }) category: string; // themeColors | axisConfig | formDefinition | htmlField
  @Prop({ required: true }) key: string; // identifier inside category
  @Prop({ type: Object }) value: any; // stored data payload
  @Prop({ default: 1 }) version: number;
  @Prop({ default: 'active' }) status: string; // active|archived
}

export type ConfigItemDocument = ConfigItem & Document;
export const ConfigItemSchema = SchemaFactory.createForClass(ConfigItem);
ConfigItemSchema.index({ appId: 1, category: 1, key: 1, status: 1, version: -1 });
ConfigItemSchema.index({ appId: 1, category: 1, key: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });