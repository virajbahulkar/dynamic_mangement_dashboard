import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { MetaService } from './meta.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { FunctionDef, FunctionDefDocument } from './schemas/function-def.schema';
import { Page, PageDocument } from './schemas/page.schema';
import { ConfigItem, ConfigItemDocument } from './schemas/config-item.schema';

@Controller('meta')
export class MetaController {
  constructor(
    private readonly meta: MetaService,
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    @InjectModel(FunctionDef.name) private fnModel: Model<FunctionDefDocument>,
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
    @InjectModel(ConfigItem.name) private configModel: Model<ConfigItemDocument>,
  ) {}

  @Get('apps/:appId/pages/:slug')
  async getPage(
    @Param('appId') appId: string,
    @Param('slug') slug: string,
    @Query('hydrate') hydrate?: string,
    @Query('include') include?: string
  ) {
    const wantsHydrate = hydrate === '1' || hydrate === 'true';
    const includeAssets = !!(include && include.split(',').includes('assets'));
    if (wantsHydrate) {
      return this.meta.getHydratedPage(appId, slug, { includeAssets });
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

  @Get('builder/bootstrap/:appId/:slug')
  async builderBootstrap(
    @Param('appId') appId: string,
    @Param('slug') slug: string,
  ) {
    const [page, assets, functions, themeColors, axisConfig] = await Promise.all([
      this.pageModel.findOne({ appId, slug, status: 'active' }),
      this.assetModel.find({ status: 'active' }, { code: 0 }),
      this.fnModel.find({ status: 'active' }, { code: 0 }),
      this.configModel.find({ appId, category: 'themeColors', status: 'active' }),
      this.configModel.find({ appId, category: 'axisConfig', status: 'active' }),
    ]);
    if (!page) throw new NotFoundException('Page not found');
    return {
      page: { _id: page._id, slug: page.slug, placements: page.placements || [] },
      assets: assets.map(a => ({ _id: a._id, name: a.name, type: a.type, parameters: a.parameters, visualizationSpec: a.visualizationSpec })),
      functions: functions.map(f => ({ _id: f._id, name: f.name, runtime: f.runtime, codeHash: f.codeHash })),
      config: {
        themeColors: themeColors.map(c => ({ key: c.key, value: c.value })),
        axisConfig: axisConfig.map(c => ({ key: c.key, value: c.value }))
      }
    };
  }
}
