import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { Page, PageSchema } from './schemas/page.schema';
import { Layout, LayoutSchema } from './schemas/layout.schema';
import { FilterForm, FilterFormSchema } from './schemas/filter-form.schema';
import { ComponentDef, ComponentSchema } from './schemas/component.schema';
import { DataSource, DataSourceSchema } from './schemas/data-source.schema';
import { TransformPipeline, TransformPipelineSchema } from './schemas/transform-pipeline.schema';
import { ConfigItem, ConfigItemSchema } from './schemas/config-item.schema';
import { Asset, AssetSchema } from './schemas/asset.schema';
import { FunctionDef, FunctionDefSchema } from './schemas/function-def.schema';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { FunctionDefsService } from './function-defs.service';
import { FunctionDefsController } from './function-defs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Page.name, schema: PageSchema },
      { name: Layout.name, schema: LayoutSchema },
      { name: FilterForm.name, schema: FilterFormSchema },
      { name: ComponentDef.name, schema: ComponentSchema, collection: 'components' },
      { name: DataSource.name, schema: DataSourceSchema },
      { name: TransformPipeline.name, schema: TransformPipelineSchema },
      { name: ConfigItem.name, schema: ConfigItemSchema },
      { name: Asset.name, schema: AssetSchema },
      { name: FunctionDef.name, schema: FunctionDefSchema },
    ]),
  ],
  controllers: [MetaController, FunctionDefsController],
  providers: [MetaService, FunctionDefsService],
  exports: [MetaService, FunctionDefsService]
})
export class MetaModule {}
