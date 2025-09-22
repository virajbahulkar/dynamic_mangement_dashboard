export class CreateDashboardConfigDto {
  name: string;
  type: string;
  data: any;
  functionRef?: string;
  appId?: string;
  pageSlug?: string;
  kind?: string;
  version?: number;
  status?: string;
}
