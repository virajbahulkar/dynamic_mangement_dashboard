import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageEntity } from './schemas/page.schema';

@Injectable()
export class PagesService {
  constructor(@InjectModel(PageEntity.name) private readonly model: Model<PageEntity>) {}

  async listIds(): Promise<string[]> {
    const docs = await this.model.find({}, { id: 1, _id: 0 }).lean();
    return docs.map((d: any) => d.id);
  }

  async get(id: string): Promise<PageEntity | null> {
    return this.model.findOne({ id }).lean<PageEntity>() as any;
  }

  async upsert(payload: Partial<PageEntity> & { id: string }): Promise<{ ok: true; id: string }> {
    const toSave: any = { id: payload.id, name: payload.name, settings: payload.settings || {}, tiles: Array.isArray(payload.tiles) ? payload.tiles : [] };
    await this.model.updateOne({ id: payload.id }, { $set: toSave }, { upsert: true });
    return { ok: true, id: payload.id };
  }
}
