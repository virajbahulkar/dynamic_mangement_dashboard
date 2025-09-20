import { PartialType } from '@nestjs/mapped-types';
import { CreateDashboardConfigDto } from './create-dashboard-config.dto';

export class UpdateDashboardConfigDto extends PartialType(CreateDashboardConfigDto) {}
