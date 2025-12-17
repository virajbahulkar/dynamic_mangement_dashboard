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

  @IsOptional()
  @IsString()
  appId?: string;

  @IsOptional()
  @IsString()
  pageSlug?: string;

  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  version?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
