import { Controller, Get } from '@nestjs/common';
import mongoose from 'mongoose';
import { Public } from '../common/api-key.guard';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  ok() {
    return { status: 'ok' };
  }

  @Get('db')
  @Public()
  db() {
    const state = mongoose.connection.readyState; // 0,1,2,3
    return {
      status: state === 1 ? 'ok' : 'not-connected',
      state,
      db: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
    };
  }

  @Get('ready')
  @Public()
  async ready() {
    const state = mongoose.connection.readyState; // 1 connected
    const essentials = ['applications', 'pages', 'components', 'datasources'];
    const collectionStatuses: Record<string, string> = {};
    if (state === 1) {
      const existing = await mongoose.connection.db?.listCollections().toArray();
      const names = new Set((existing || []).map(c => c.name));
      for (const col of essentials) {
        collectionStatuses[col] = names.has(col) ? 'present' : 'missing';
      }
    }
    return {
      status: state === 1 ? 'ready' : 'not-ready',
      dbState: state,
      collections: collectionStatuses,
      timestamp: new Date().toISOString()
    };
  }
}
