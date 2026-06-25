import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, JwtPayload } from '../interfaces/authenticated-request.interface';

export function extraerUsuarioActual(_data: unknown, ctx: ExecutionContext): JwtPayload {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
}

export const CurrentUser = createParamDecorator(extraerUsuarioActual);
