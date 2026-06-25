import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums/role.enum';

function crearContexto(rolUsuario: Role): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { rol: rolUsuario } }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as unknown as jest.Mocked<Reflector>;
    guard = new RolesGuard(reflector);
  });

  it('permite el acceso cuando la ruta no exige roles específicos', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const resultado = guard.canActivate(crearContexto(Role.FARMACEUTICO));

    expect(resultado).toBe(true);
  });

  it('permite el acceso cuando el rol del usuario está entre los permitidos', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMINISTRADOR]);

    const resultado = guard.canActivate(crearContexto(Role.ADMINISTRADOR));

    expect(resultado).toBe(true);
  });

  it('niega el acceso cuando el rol del usuario no está entre los permitidos', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMINISTRADOR]);

    const resultado = guard.canActivate(crearContexto(Role.FARMACEUTICO));

    expect(resultado).toBe(false);
  });
});
