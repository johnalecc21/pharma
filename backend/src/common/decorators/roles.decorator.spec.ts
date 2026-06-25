import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from './roles.decorator';
import { Role } from '../enums/role.enum';

describe('Roles decorator', () => {
  it('asigna los roles permitidos como metadata en el handler', () => {
    class Controlador {
      @Roles(Role.ADMINISTRADOR, Role.FARMACEUTICO)
      metodo(): void {}
    }

    const reflector = new Reflector();
    const roles = reflector.get<Role[]>(ROLES_KEY, Controlador.prototype.metodo);

    expect(roles).toEqual([Role.ADMINISTRADOR, Role.FARMACEUTICO]);
  });
});
