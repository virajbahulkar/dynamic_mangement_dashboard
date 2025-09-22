import { CreateDashboardConfigDto } from './create-dashboard-config.dto';

export class UpdateDashboardConfigDto implements Partial<CreateDashboardConfigDto> {
  name?: string;
  type?: string;
  data?: any;
  functionRef?: string;
  appId?: string;
  pageSlug?: string;
  kind?: string;
  version?: number;
  status?: string;
}
