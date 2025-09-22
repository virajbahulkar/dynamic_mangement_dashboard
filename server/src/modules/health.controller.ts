import { Controller, Get } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('health')
export class HealthController {
  @Get()
  ok() {
    return { status: 'ok' };
  }

  @Get('db')
  db() {
    const state = mongoose.connection.readyState; // 0,1,2,3
    return {
      status: state === 1 ? 'ok' : 'not-connected',
      state,
      db: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
    };
  }
}
