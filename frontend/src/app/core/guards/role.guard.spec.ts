import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

describe('roleGuard', () => {
  let authService: { rolActual: jest.Mock };
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authService = { rolActual: jest.fn() };
    router = { createUrlTree: jest.fn().mockReturnValue('url-tree-login') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('permite el acceso cuando el rol del usuario está permitido', () => {
    authService.rolActual.mockReturnValue(Role.ADMINISTRADOR);
    const guard = roleGuard([Role.ADMINISTRADOR]);

    const resultado = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(resultado).toBe(true);
  });

  it('redirige a /login cuando el rol no está permitido', () => {
    authService.rolActual.mockReturnValue(Role.FARMACEUTICO);
    const guard = roleGuard([Role.ADMINISTRADOR]);

    const resultado = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(resultado).toBe('url-tree-login');
  });

  it('redirige a /login cuando no hay usuario autenticado', () => {
    authService.rolActual.mockReturnValue(null);
    const guard = roleGuard([Role.ADMINISTRADOR]);

    const resultado = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(resultado).toBe('url-tree-login');
  });
});
