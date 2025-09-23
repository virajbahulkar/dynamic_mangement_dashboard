// Lightweight logger that injects correlation id when available
// Avoids dependency on full Nest Logger for now.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AppLogger {
  constructor(private context?: string) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fmt(level: string, msg: any, meta?: any) {
    const ts = new Date().toISOString();
    const cid = (meta && meta.correlationId) || (meta && meta.req && meta.req.correlationId) || meta?.cid;
    const base: any = { t: ts, lvl: level, ctx: this.context, msg };
    if (cid) base.cid = cid;
    if (meta && meta.extra) base.extra = meta.extra;
    // Fallback to console.*
    const line = JSON.stringify(base);
    if (level === 'error') console.error(line); else if (level === 'warn') console.warn(line); else console.log(line);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(msg: any, meta?: any) { this.fmt('info', msg, meta); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(msg: any, meta?: any) { this.fmt('warn', msg, meta); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(msg: any, meta?: any) { this.fmt('error', msg, meta); }
  child(context: string) { return new AppLogger(context); }
}

export const rootLogger = new AppLogger('root');
