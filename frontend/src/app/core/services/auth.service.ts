import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, shareReplay, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse, LoginRequest, RegisterRequest, Usuario } from '../models/usuario.model';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioActual = signal<Usuario | null>(null);
  private refrescandoToken$: Observable<AuthResponse> | null = null;

  readonly usuario = computed(() => this.usuarioActual());
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);
  readonly rolActual = computed<Role | null>(() => this.usuarioActual()?.rol ?? null);

  constructor(
    private readonly api: ApiService,
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router,
  ) {
    this.usuarioActual.set(this.tokenStorage.obtenerUsuario());
  }

  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/login', credenciales)
      .pipe(tap((respuesta) => this.establecerSesion(respuesta)));
  }

  register(datos: RegisterRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/register', datos)
      .pipe(tap((respuesta) => this.establecerSesion(respuesta)));
  }

  refrescarToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenStorage.obtenerRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    if (!this.refrescandoToken$) {
      this.refrescandoToken$ = this.api.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
        tap((respuesta) => this.establecerSesion(respuesta)),
        shareReplay(1),
        finalize(() => {
          this.refrescandoToken$ = null;
        }),
      );
    }

    return this.refrescandoToken$;
  }

  logout(): void {
    const refreshToken = this.tokenStorage.obtenerRefreshToken();

    if (refreshToken) {
      this.api
        .post('/auth/logout', { refreshToken })
        .pipe(catchError(() => of(undefined)))
        .subscribe();
    }

    this.tokenStorage.limpiarSesion();
    this.usuarioActual.set(null);
    void this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return this.tokenStorage.obtenerToken();
  }

  private establecerSesion(respuesta: AuthResponse): void {
    this.tokenStorage.guardarSesion(respuesta.accessToken, respuesta.refreshToken, respuesta.usuario);
    this.usuarioActual.set(respuesta.usuario);
  }
}
