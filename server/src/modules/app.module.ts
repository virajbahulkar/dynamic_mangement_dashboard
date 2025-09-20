
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardConfigModule } from './dashboard-config/dashboard-config.module';
import { HealthController } from './health.controller';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    DashboardConfigModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {
  constructor() {
    mongoose.connection.on('connected', () =>
      console.log('[Mongo] connected:', mongoose.connection.name)
    );
    mongoose.connection.on('error', (err) =>
      console.error('[Mongo] error:', err.message)
    );
    mongoose.connection.on('disconnected', () =>
      console.warn('[Mongo] disconnected')
    );
  }
}
