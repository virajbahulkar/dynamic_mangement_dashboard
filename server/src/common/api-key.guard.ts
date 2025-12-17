import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PUBLIC_KEY = 'isPublic';
export function Public(): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PUBLIC_KEY, true, descriptor.value!);
    return descriptor;
  };
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, handler);
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest();
    const key = (req.headers['x-api-key'] as string) || '';
    const configured = (process.env.API_KEYS || '').split(/[,\s]+/).filter(Boolean);
    if (!configured.length) return true; // if no keys configured, allow (development convenience)
    if (!key || !configured.includes(key)) throw new UnauthorizedException('Invalid API key');
    return true;
  }
}
