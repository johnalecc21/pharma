import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { estaAutenticado: jest.Mock };
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authService = { estaAutenticado: jest.fn() };
    router = { createUrlTree: jest.fn().mockReturnValue('url-tree-login') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('permite el acceso cuando el usuario está autenticado', () => {
    authService.estaAutenticado.mockReturnValue(true);

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(resultado).toBe(true);
  });

  it('redirige a /login cuando el usuario no está autenticado', () => {
    authService.estaAutenticado.mockReturnValue(false);

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(resultado).toBe('url-tree-login');
  });
});
