import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('db/pages')
export class PagesController {
  constructor(private readonly pages: PagesService) {}

  @Get()
  async list() {
    const ids = await this.pages.listIds();
    return { ids };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const safe = String(id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const doc = await this.pages.get(safe);
    if (!doc) return { error: 'not_found' };
    return doc;
  }

  @Post(':id')
  async save(@Param('id') id: string, @Body() body: any) {
    const safe = String(id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const res = await this.pages.upsert({ id: safe, ...body });
    return res;
  }
}
