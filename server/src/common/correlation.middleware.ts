import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const CORRELATION_HEADER = 'x-correlation-id';
export const API_KEY_HEADER = 'x-api-key';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const existing = (req.headers[CORRELATION_HEADER] as string) || '';
    const id = existing || randomBytes(8).toString('hex');
    (req as any).correlationId = id;
    next();
  }
}
