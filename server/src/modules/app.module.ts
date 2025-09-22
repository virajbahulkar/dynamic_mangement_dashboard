import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardConfigModule } from './dashboard-config/dashboard-config.module';
import { MetaModule } from './meta/meta.module';
import { HealthController } from './health.controller';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
  DashboardConfigModule,
  MetaModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
