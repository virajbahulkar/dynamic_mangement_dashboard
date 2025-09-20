import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { DashboardConfigService } from './dashboard-config.service';
import { CreateDashboardConfigDto } from './dto/create-dashboard-config.dto';
import { UpdateDashboardConfigDto } from './dto/update-dashboard-config.dto';

@Controller('dashboard-config')
export class DashboardConfigController {
  constructor(private readonly service: DashboardConfigService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateDashboardConfigDto) {
    return this.service.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDashboardConfigDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('seed')
  async seed(@Body() items: CreateDashboardConfigDto[]) {
    return this.service.seed(items);
  }
}
