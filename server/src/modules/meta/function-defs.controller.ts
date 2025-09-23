import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FunctionDefsService } from './function-defs.service';

@Controller('meta/functions')
export class FunctionDefsController {
  constructor(private readonly svc: FunctionDefsService) {}

  @Post()
  async create(@Body() body: any) {
    // Accept direct shape; validation minimal for now
    return this.svc.create(body);
  }

  @Get()
  async list() {
    return this.svc.list();
  }

  @Get(':name')
  async getOne(@Param('name') name: string) {
    return this.svc.getByName(name);
  }
}
