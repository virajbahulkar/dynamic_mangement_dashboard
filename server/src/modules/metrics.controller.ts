import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/api-key.guard';

interface TelemetryEvent {
  type: string;
  path?: string;
  method?: string;
  status?: number | string;
  durationMs?: number;
  correlationId?: string;
  ok?: boolean;
  retries?: number;
  meta?: Record<string, unknown>;
  ts?: number;
}

@Controller('metrics')
export class MetricsController {
  @Post()
  @Public()
  ingest(@Body() body: unknown) {
    // Some upstream body parser error cases may leave body as a stream or undefined.
    let events: TelemetryEvent[] = [];
    try {
      if (body && typeof body === 'object') {
        const maybe = (body as any).events;
        if (Array.isArray(maybe)) events = maybe.filter(e => e && typeof e === 'object');
      }
    } catch {
      events = [];
    }
    const summary = events.reduce((acc, ev) => {
      const key = `${ev.method || 'GET'} ${ev.path || ''}`;
      if (!acc[key]) acc[key] = { count: 0, total: 0 };
      acc[key].count++;
      if (typeof ev.durationMs === 'number') acc[key].total += ev.durationMs;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);
    const routes = Object.entries(summary).map(([route, v]) => ({ route, count: v.count, avgMs: +(v.total / v.count).toFixed(2) }));
    const nodeProc: any = (globalThis as any).process;
    if (nodeProc && nodeProc.env && nodeProc.env.NODE_ENV !== 'production' && events.length) {
      console.log('[metrics] batch accepted=%d uniqueRoutes=%d', events.length, routes.length);
    }
    return { accepted: events.length, routes };
  }
}
