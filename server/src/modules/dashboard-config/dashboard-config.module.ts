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
      },
      {
        name: 'sidebar',
        type: 'layout',
        data: {
          template: {
            headerContent: { isVisible: true, logo: '', width: '150', title: '' },
            hederActions: { isVisible: false, title: '', action: '' },
            links: [
              {
                title: 'Dashboard',
                links: [ { name: 'management-dashboard', icon: 'FiShoppingBag' } ]
              },
              {
                title: 'Dyanamic Components',
                links: [
                  { name: 'dynamic-form', icon: 'FiShoppingBag' },
                  { name: 'dynamic-html-components', icon: 'FiShoppingBag' }
                ]
              }
            ]
          }
        },
        functionRef: null
      },
      {
        name: 'navbar',
        type: 'layout',
        data: {
          template: {
            config: { dataKey: 'channel-performance-megazone', dataType: 'currentUserData', method: 'get', apiKey: '/users/current_user' },
            contentData: [
              { title: 'Menu', greeting: '', type: 'button', subtext: '', icon: 'AiOutlineMenu', action: { type: 'handleActiveMenu' }, color: '' },
              { text: 'Management Dashboard', greeting: '', type: 'title', subtext: 'Inventory / Pipeline', icon: '', align: 'start', color: '' },
              { title: 'Notification', greeting: '', type: 'button', icon: 'RiNotification3Line', action: { type: 'click', value: 'notification' }, color: '' },
              { title: 'Michale', greeting: 'Hi, ', type: 'panel', icon: '', action: { type: 'click', value: 'userProfile' }, color: '' },
              { title: 'Logout', greeting: '', type: 'button', icon: 'BsBoxArrowRight', align: 'right', action: { type: 'click', value: 'logout' }, color: '' }
            ]
          }
        },
        functionRef: null
      },
      {
        name: 'management-dashboard-page-v1',
        type: 'page-layout',
        kind: 'page',
        appId: 'default',
        pageSlug: 'management-dashboard',
        version: 1,
        status: 'active',
        data: {
          tabs: [
            {
              title: 'Management Dashboard',
              rows: [
                {
                  id: 1,
                  quadrants: [
                    {
                      type: 'table',
                      title: 'Channel performance',
                      span: 3,
                      config: {
                        quadrantDataKey: 'channelPerformanceData',
                        dataType: 'issuanceData',
                        method: 'get',
                        apiKey: '/management-dashboard/channel-performance',
                        headingsRef: 'employeesGrid'
                          },
                          dataSource: {
                            transport: 'rest',
                            method: 'get',
                            url: '/management-dashboard/channel-performance',
                            pollingMs: 60000,
                            transform: [
                              { op: 'pick', path: 'rows' }
                            ]
                          }
                    },
                    {
                      type: 'chart',
                      title: 'YOY comparison',
                      span: 2,
                      config: {
                        dataType: 'yoyData',
                        method: 'get',
                        apiKey: '/management-dashboard/channel-performance-yoy',
                        variant: 'stacked-bar'
                          },
                          dataSource: {
                            transport: 'rest',
                            method: 'get',
                            url: '/management-dashboard/channel-performance-yoy',
                            pollingMs: 120000,
                            transform: [
                              { op: 'pick', path: 'series' }
                            ]
                          }
                    }
                  ]
                },
                {
                  id: 2,
                  quadrants: [
                    {
                      type: 'table',
                      title: 'Persistency',
                      span: 'full',
                      config: {
                        quadrantDataKey: 'persistencydata',
                        dataType: 'persistanyData',
                        apiKey: '/management-dashboard/persistency',
                        method: 'get',
                        headingsRef: 'persistencyGrid'
                      },
                      dataSource: {
                        transport: 'rest',
                        method: 'get',
                        url: '/management-dashboard/persistency',
                        pollingMs: 180000,
                        transform: [
                          { op: 'pick', path: 'rows' }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        functionRef: null
      }
    ];
    await this.svc.seed(seedItems as any);
    this.logger.log('DashboardConfig seed completed');
  }
}
