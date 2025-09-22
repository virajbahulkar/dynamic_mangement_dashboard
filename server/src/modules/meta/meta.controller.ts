import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Get('apps/:appId/pages/:slug')
  async getPage(
    @Param('appId') appId: string,
    @Param('slug') slug: string,
    @Query('hydrate') hydrate?: string
  ) {
    const wantsHydrate = hydrate === '1' || hydrate === 'true';
    if (wantsHydrate) {
      return this.meta.getHydratedPage(appId, slug);
    }
    const pageOnly = await this.meta['pageModel']?.findOne?.({ appId, slug, status: 'active' });
    if (!pageOnly) throw new NotFoundException('Page not found');
    return { page: pageOnly };
  }

  @Get('apps/:appId/config/:category')
  async getConfigItems(
    @Param('appId') appId: string,
    @Param('category') category: string
  ) {
    const items = await this.meta.getConfigItems(appId, category);
    return { appId, category, items };
  }
}
