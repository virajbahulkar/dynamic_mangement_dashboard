// Primary application bootstrap (enhanced configuration)
import * as path from 'path';
import * as dotenv from 'dotenv';
// Attempt to load root-level .env (mono repo root) BEFORE anything uses process.env
(() => {
  const candidates = [
    process.env.ENV_FILE,
    path.resolve(process.cwd(), '.env'), // when launched from repo root
    path.resolve(__dirname, '../../.env'), // when launched from server directory or dist
    path.resolve(__dirname, '../../../.env'),
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      const res = dotenv.config({ path: p });
      if (!res.error) {
        // eslint-disable-next-line no-console
        console.log('[env] loaded', p);
        break;
      }
    } catch {/* ignore */}
  }
})();
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { urlencoded, json } from 'express';
import { AppModule } from './app.module';
import { CorrelationIdMiddleware } from './common/correlation.middleware';
import { rootLogger } from './common/logger.service';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

// Minimal declaration to satisfy TypeScript when node types not globally included.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;
// import { ValidationPipe } from '@nestjs/common'; // (Optional) enable global validation later

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    abortOnError: false,
    bodyParser: false, // disable Nest's built-in body parsing to avoid double consumption
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(new CorrelationIdMiddleware().use);
  app.use(compression());
  app.use(cookieParser());
  // Single JSON parser (avoid duplicates). If needed, add verify hook later.
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));

  // Enable CORS for local development client
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ];
  const allowedOrigins = (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(/[\s,]+/) : defaultOrigins).filter(Boolean);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // non-browser or same-origin
      if (allowedOrigins.includes(origin)) return cb(null, true);
      // Allow wildcard dev override
      if (process.env.CORS_ALLOW_ALL === 'true') return cb(null, true);
      return cb(new Error('CORS blocked: ' + origin), false);
    },
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type,Accept,X-Requested-With,x-api-key,x-correlation-id',
    exposedHeaders: 'Content-Length,x-correlation-id',
    maxAge: 600,
  });

  // Lightweight page persistence endpoints (dev convenience)
  const pagesDir = process.env.PAGES_DIR || path.resolve(process.cwd(), 'data/pages');
  try { fs.mkdirSync(pagesDir, { recursive: true }); } catch {}
  const pagesCache: Record<string, any> = Object.create(null);
  const loadPageFile = (id: string) => {
    const fp = path.join(pagesDir, `${id}.json`);
    try { const raw = fs.readFileSync(fp, 'utf8'); return JSON.parse(raw); } catch { return null; }
  };
  const savePageFile = (id: string, data: any) => {
    const fp = path.join(pagesDir, `${id}.json`);
    fs.writeFileSync(fp, JSON.stringify(data, null, 2));
  };
  const expressApp = app.getHttpAdapter().getInstance();
  // Handle CORS preflight explicitly for safety on these routes
  expressApp.options('/pages/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,X-Requested-With,x-api-key,x-correlation-id');
    res.status(204).end();
  });
  expressApp.options('/pages', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,X-Requested-With,x-api-key,x-correlation-id');
    res.status(204).end();
  });
  expressApp.get('/pages', (req, res) => {
    try {
      const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));
      const ids = files.map(f => f.replace(/\.json$/, ''));
      res.json({ ids });
    } catch (e) {
      res.status(500).json({ error: 'Failed to list pages' });
    }
  });
  expressApp.get('/pages/:id', (req, res) => {
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g,'');
    const cached = pagesCache[id] || loadPageFile(id);
    if (!cached) return res.status(404).json({ error: 'Not found' });
    pagesCache[id] = cached;
    return res.json(cached);
  });
  expressApp.post('/pages/:id', (req, res) => {
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g,'');
    const body = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    // Accept arbitrary page payload; ensure tiles is an array for compatibility
    const tiles = Array.isArray(body.tiles) ? body.tiles : [];
    const payload = { id, ...body, tiles, updatedAt: new Date().toISOString() };
    pagesCache[id] = payload;
    try { savePageFile(id, payload); } catch {}
    return res.json({ ok: true, id });
  });
  // Alias: /drafts/:id -> same handlers (dev ergonomics)
  expressApp.options('/drafts/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,X-Requested-With,x-api-key,x-correlation-id');
    res.status(204).end();
  });
  expressApp.get('/drafts/:id', (req, res) => {
    req.url = `/pages/${req.params.id}`;
    return expressApp._router.handle(req, res);
  });
  expressApp.post('/drafts/:id', (req, res) => {
    req.url = `/pages/${req.params.id}`;
    return expressApp._router.handle(req, res);
  });

  // Prefer explicit PORT, then API_PORT, else default to 3002 (project standard)
  const port = Number(process.env.PORT || process.env.API_PORT || 3002);
  await app.listen(port);
  rootLogger.log(`Server running on http://localhost:${port}`);
  try {
    const httpServer: any = app.getHttpServer();
    const router = httpServer?._events?.request?._router;
    if (router?.stack) {
      const routes = router.stack
        .filter((l: any) => l.route)
        .map((l: any) => {
          const methods = Object.keys(l.route.methods)
            .map(m => m.toUpperCase())
            .join(',');
          return `${methods} ${l.route.path}`;
        })
        .sort();
      console.log('[routes]', routes);
    }
  } catch (e) {
    // Non-fatal; route enumeration is best-effort for local diagnostics
  }
}

bootstrap();
