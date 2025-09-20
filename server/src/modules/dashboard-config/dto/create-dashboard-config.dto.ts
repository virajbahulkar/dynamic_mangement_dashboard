import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDashboardConfigDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  functionRef?: string;
}
