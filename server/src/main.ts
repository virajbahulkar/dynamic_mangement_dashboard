// Primary application bootstrap (enhanced configuration)
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { urlencoded, json } from 'express';
import { AppModule } from './modules/app.module';
import { CorrelationIdMiddleware } from './common/correlation.middleware';
import { rootLogger } from './common/logger.service';
import { ValidationPipe } from '@nestjs/common';

// Minimal declaration to satisfy TypeScript when node types not globally included.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;
// import { ValidationPipe } from '@nestjs/common'; // (Optional) enable global validation later

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    abortOnError: false,
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(new CorrelationIdMiddleware().use);
  app.use(compression());
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));

  // Enable CORS for local development client
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:5173').split(/[,\s]+/);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked: ' + origin), false);
    },
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type,Accept',
    exposedHeaders: 'Content-Length'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  rootLogger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
