import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardConfig, DashboardConfigSchema } from '../dashboard-config.schema';
import { DashboardConfigService } from './dashboard-config.service';
import { DashboardConfigController } from './dashboard-config.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DashboardConfig.name, schema: DashboardConfigSchema },
    ]),
  ],
  controllers: [DashboardConfigController],
  providers: [DashboardConfigService],
  exports: [DashboardConfigService],
})
export class DashboardConfigModule implements OnModuleInit {
  private readonly logger = new Logger(DashboardConfigModule.name);

  constructor(private readonly svc: DashboardConfigService) {}

  async onModuleInit() {
    if (process.env.SEED_DASHBOARD_CONFIG !== 'true') return;
    const existing = await this.svc.findAll();
    if (existing && existing.length > 0) {
      this.logger.log('DashboardConfig seed skipped (already populated)');
      return;
    }
    const seedItems = [
      {
        name: 'Sample Chart',
        type: 'chart',
        data: { series: [5, 9, 2], meta: { note: 'seeded' } },
        functionRef: 'parseSampleChart'
      },
      {
        name: 'Sample Table',
        type: 'table',
        data: { headers: ['A','B'], rows: [[1,2],[3,4]] },
        functionRef: 'formatSampleTable'
      }
    ];
    await this.svc.seed(seedItems as any);
    this.logger.log('DashboardConfig seed completed');
  }
}
