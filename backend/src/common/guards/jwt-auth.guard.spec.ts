import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: JwtAuthGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as unknown as jest.Mocked<Reflector>;
    guard = new JwtAuthGuard(reflector);
    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('permite el acceso sin validar JWT cuando la ruta es pública', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const resultado = guard.canActivate(context);

    expect(resultado).toBe(true);
  });

  it('delega en la estrategia JWT cuando la ruta no es pública', () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    const prototipoBase = Object.getPrototypeOf(JwtAuthGuard.prototype);
    const superCanActivate = jest.spyOn(prototipoBase, 'canActivate').mockReturnValue(true);

    const resultado = guard.canActivate(context);

    expect(superCanActivate).toHaveBeenCalledWith(context);
    expect(resultado).toBe(true);

    superCanActivate.mockRestore();
  });
});
