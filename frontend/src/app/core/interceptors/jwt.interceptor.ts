import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const RUTAS_SIN_RETRY = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

function esRutaDeAuth(url: string): boolean {
  return RUTAS_SIN_RETRY.some((ruta) => url.includes(ruta));
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  const reqConToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken).pipe(
    catchError((error: unknown) => {
      const esNoAutorizado = error instanceof HttpErrorResponse && error.status === 401;

      if (!esNoAutorizado || esRutaDeAuth(req.url)) {
        return throwError(() => error);
      }

      return authService.refrescarToken().pipe(
        switchMap((respuesta) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${respuesta.accessToken}` },
            }),
          ),
        ),
        catchError((errorRefresh: unknown) => {
          authService.logout();
          return throwError(() => errorRefresh);
        }),
      );
    }),
  );
};
