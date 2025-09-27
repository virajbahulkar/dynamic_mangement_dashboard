import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/api-key.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardConfigModule } from './modules/dashboard-config/dashboard-config.module';
import { MetaModule } from './modules/meta/meta.module';
import { HealthController } from './modules/health.controller';
import { MetricsController } from './modules/metrics.controller';
import { ThemeController } from './modules/theme.controller';
import { UsersController } from './modules/users.controller';
import { RegistryModule } from './modules/registry/registry.module';
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

const mongoImports = ((): any[] => {
  if (process.env.SKIP_DB === '1') {
    console.warn('[Mongo] SKIP_DB=1 -> skipping Mongo connection');
    return [];
  }
  return [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = process.env.MONGO_URI as string;
        if (!uri) console.error('[Mongo] MONGO_URI not set');
        else {
          const masked = uri.replace(/:\/\/[^@]+@/, '://***@');
          console.log('[Mongo] attempting connection to', masked);
        }
        return { uri, serverSelectionTimeoutMS: 3000 } as any;
      }
    })
  ];
})();

@Module({
  imports: [
    ...mongoImports,
    DashboardConfigModule,
    MetaModule,
    RegistryModule,
  ],
  controllers: [HealthController, MetricsController, ThemeController, UsersController],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard }
  ],
})
export class AppModule implements OnApplicationBootstrap {
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
  async onApplicationBootstrap() {
    if (mongoose.connection.readyState === 1) return;
    const uri = process.env.MONGO_URI as string;
    if (!uri) return;
    try {
      await mongoose.connect(uri);
      console.log('[Mongo] manual connect established:', mongoose.connection.name);
    } catch (e: any) {
      console.error('[Mongo] manual connect failed:', e?.message);
    }
  }
}
