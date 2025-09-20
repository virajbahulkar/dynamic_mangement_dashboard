import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DashboardConfig, DashboardConfigDocument } from '../dashboard-config.schema';
import { CreateDashboardConfigDto } from './dto/create-dashboard-config.dto';
import { UpdateDashboardConfigDto } from './dto/update-dashboard-config.dto';

@Injectable()
export class DashboardConfigService {
  constructor(
    @InjectModel(DashboardConfig.name)
    private readonly dashboardConfigModel: Model<DashboardConfigDocument>,
  ) {}

  async findAll() {
    return this.dashboardConfigModel.find().lean();
  }

  async findOne(id: string) {
    const doc = await this.dashboardConfigModel.findById(id).lean();
    if (!doc) throw new NotFoundException('DashboardConfig not found');
    return doc;
  }

  async create(payload: CreateDashboardConfigDto) {
    return this.dashboardConfigModel.create(payload);
  }

  async update(id: string, payload: UpdateDashboardConfigDto) {
    const doc = await this.dashboardConfigModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!doc) throw new NotFoundException('DashboardConfig not found');
    return doc;
  }

  async remove(id: string) {
    const res = await this.dashboardConfigModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('DashboardConfig not found');
    return { deleted: true };
  }

  async seed(seedItems: CreateDashboardConfigDto[]) {
    if (!Array.isArray(seedItems)) return [];
    // simplistic seed: upsert by name
    const results = [] as any[];
    for (const item of seedItems) {
      const existing = await this.dashboardConfigModel.findOne({ name: item.name });
      if (existing) {
        existing.set(item as any);
        await existing.save();
        results.push(existing.toObject());
      } else {
        const created = await this.dashboardConfigModel.create(item);
        results.push(created.toObject());
      }
    }
    return results;
  }
}
