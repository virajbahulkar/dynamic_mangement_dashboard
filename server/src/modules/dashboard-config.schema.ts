
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DashboardConfigDocument = DashboardConfig & Document;

@Schema()
export class DashboardConfig {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // e.g., 'chart', 'table', etc.

  @Prop({ type: Object, required: true })
  data: any; // Stores the full config/data from dummy.js

  @Prop({ required: false })
  functionRef: string; // Name of the custom function from dummy.js
}

export const DashboardConfigSchema = SchemaFactory.createForClass(DashboardConfig);
