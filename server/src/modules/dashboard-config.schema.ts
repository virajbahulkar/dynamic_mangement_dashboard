
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DashboardConfigDocument = DashboardConfig & Document;
@Schema({ timestamps: true })
export class DashboardConfig {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // e.g., 'chart', 'table', etc.

  @Prop({ type: Object, required: true })
  data: any; // Stores the full config/data from dummy.js

  @Prop({ required: false })
  functionRef: string; // Name of the custom function from dummy.js

  // New fields for multi-app + page layout + versioning
  @Prop({ required: false, default: 'default' })
  appId?: string; // logical application/group

  @Prop({ required: false })
  pageSlug?: string; // slug for page (e.g., management-dashboard)

  @Prop({ required: false, default: 'component' })
  kind?: string; // 'layout' | 'page' | 'component'

  @Prop({ required: false, default: 1 })
  version?: number; // simple numeric version

  @Prop({ required: false, default: 'active' })
  status?: string; // 'draft' | 'active' | 'archived'
}

export const DashboardConfigSchema = SchemaFactory.createForClass(DashboardConfig);

// Indexes
DashboardConfigSchema.index({ appId: 1, pageSlug: 1, name: 1 });
DashboardConfigSchema.index({ name: 1 });
DashboardConfigSchema.index({ appId: 1, kind: 1 });
