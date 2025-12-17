import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PageEntity, PageSchema } from './schemas/page.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PageEntity.name, schema: PageSchema }])],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
