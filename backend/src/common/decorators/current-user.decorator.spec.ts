import { ExecutionContext } from '@nestjs/common';
import { extraerUsuarioActual } from './current-user.decorator';
import { Role } from '../enums/role.enum';

describe('extraerUsuarioActual', () => {
  it('obtiene el usuario autenticado desde la request', () => {
    const usuario = { sub: 'usuario-1', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: usuario }),
      }),
    } as unknown as ExecutionContext;

    const resultado = extraerUsuarioActual(undefined, context);

    expect(resultado).toBe(usuario);
  });
});
