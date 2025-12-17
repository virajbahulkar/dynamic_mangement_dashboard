import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, minimize: false })
export class PageEntity extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  id!: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: Object, default: {} })
  settings?: Record<string, any>;

  @Prop({ type: Array, default: [] })
  tiles!: any[];
}

export const PageSchema = SchemaFactory.createForClass(PageEntity);
