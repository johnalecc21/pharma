import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth.service';

describe('jwtInterceptor', () => {
  let authService: { obtenerToken: jest.Mock; refrescarToken: jest.Mock; logout: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    authService = {
      obtenerToken: jest.fn(),
      refrescarToken: jest.fn(),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
  });

  it('agrega el header Authorization cuando hay token', () => {
    authService.obtenerToken.mockReturnValue('token-falso');
    next = jest.fn().mockReturnValue(of('respuesta-falsa'));
    const req = new HttpRequest('GET', '/medicamentos');

    TestBed.runInInjectionContext(() => jwtInterceptor(req, next).subscribe());

    const reqClonada = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(reqClonada.headers.get('Authorization')).toBe('Bearer token-falso');
  });

  it('no modifica la request cuando no hay token', () => {
    authService.obtenerToken.mockReturnValue(null);
    next = jest.fn().mockReturnValue(of('respuesta-falsa'));
    const req = new HttpRequest('GET', '/medicamentos');

    TestBed.runInInjectionContext(() => jwtInterceptor(req, next).subscribe());

    expect(next).toHaveBeenCalledWith(req);
  });

  it('ante un 401 en una ruta de negocio, refresca el token y reintenta la request', (done) => {
    authService.obtenerToken.mockReturnValue('token-expirado');
    authService.refrescarToken.mockReturnValue(
      of({ accessToken: 'token-nuevo', refreshToken: 'refresh-nuevo', usuario: {} }),
    );

    const error401 = new HttpErrorResponse({ status: 401 });
    next = jest
      .fn()
      .mockReturnValueOnce(throwError(() => error401))
      .mockReturnValueOnce(of('respuesta-tras-reintento'));

    const req = new HttpRequest('GET', '/medicamentos');

    TestBed.runInInjectionContext(() =>
      jwtInterceptor(req, next).subscribe((resultado) => {
        expect(authService.refrescarToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(2);
        const reqReintentada = next.mock.calls[1][0] as HttpRequest<unknown>;
        expect(reqReintentada.headers.get('Authorization')).toBe('Bearer token-nuevo');
        expect(resultado).toBe('respuesta-tras-reintento');
        done();
      }),
    );
  });

  it('si el refresh falla, cierra la sesión y propaga el error', (done) => {
    authService.obtenerToken.mockReturnValue('token-expirado');
    authService.refrescarToken.mockReturnValue(throwError(() => new Error('refresh inválido')));

    const error401 = new HttpErrorResponse({ status: 401 });
    next = jest.fn().mockReturnValue(throwError(() => error401));

    const req = new HttpRequest('GET', '/medicamentos');

    TestBed.runInInjectionContext(() =>
      jwtInterceptor(req, next).subscribe({
        error: () => {
          expect(authService.logout).toHaveBeenCalled();
          done();
        },
      }),
    );
  });

  it('no intenta refrescar el token si el 401 viene de /auth/login', (done) => {
    authService.obtenerToken.mockReturnValue(null);
    const error401 = new HttpErrorResponse({ status: 401 });
    next = jest.fn().mockReturnValue(throwError(() => error401));

    const req = new HttpRequest('POST', '/auth/login', {});

    TestBed.runInInjectionContext(() =>
      jwtInterceptor(req, next).subscribe({
        error: () => {
          expect(authService.refrescarToken).not.toHaveBeenCalled();
          done();
        },
      }),
    );
  });

  it('propaga errores distintos de 401 sin intentar refrescar', (done) => {
    authService.obtenerToken.mockReturnValue('token-falso');
    const error500 = new HttpErrorResponse({ status: 500 });
    next = jest.fn().mockReturnValue(throwError(() => error500));

    const req = new HttpRequest('GET', '/medicamentos');

    TestBed.runInInjectionContext(() =>
      jwtInterceptor(req, next).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(authService.refrescarToken).not.toHaveBeenCalled();
          expect(error.status).toBe(500);
          done();
        },
      }),
    );
  });
});
