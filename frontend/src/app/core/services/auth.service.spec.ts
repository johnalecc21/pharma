import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { Role } from '../models/role.enum';
import { AuthResponse } from '../models/usuario.model';

describe('AuthService', () => {
  let api: jest.Mocked<ApiService>;
  let tokenStorage: jest.Mocked<TokenStorageService>;
  let router: { navigate: jest.Mock };
  let service: AuthService;

  const respuesta: AuthResponse = {
    accessToken: 'token-falso',
    refreshToken: 'refresh-falso',
    usuario: { id: '1', nombre: 'Admin', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR },
  };

  beforeEach(() => {
    api = { get: jest.fn(), post: jest.fn(), patch: jest.fn(), put: jest.fn(), delete: jest.fn() } as unknown as jest.Mocked<ApiService>;
    tokenStorage = {
      obtenerUsuario: jest.fn().mockReturnValue(null),
      obtenerToken: jest.fn(),
      obtenerRefreshToken: jest.fn(),
      guardarSesion: jest.fn(),
      limpiarSesion: jest.fn(),
    } as unknown as jest.Mocked<TokenStorageService>;
    router = { navigate: jest.fn() };

    service = new AuthService(api, tokenStorage, router as never);
  });

  it('al construirse, restaura el usuario desde el almacenamiento local', () => {
    tokenStorage.obtenerUsuario.mockReturnValue(respuesta.usuario);

    const nuevoServicio = new AuthService(api, tokenStorage, router as never);

    expect(nuevoServicio.usuario()).toEqual(respuesta.usuario);
    expect(nuevoServicio.estaAutenticado()).toBe(true);
    expect(nuevoServicio.rolActual()).toBe(Role.ADMINISTRADOR);
  });

  it('estaAutenticado y rolActual son null/false sin sesión', () => {
    expect(service.estaAutenticado()).toBe(false);
    expect(service.rolActual()).toBeNull();
  });

  it('login guarda la sesión (incluido el refresh token) y actualiza el estado reactivo', (done) => {
    api.post.mockReturnValue(of(respuesta));

    service.login({ email: 'admin@pharmadash.com', password: 'password123' }).subscribe(() => {
      expect(tokenStorage.guardarSesion).toHaveBeenCalledWith(
        'token-falso',
        'refresh-falso',
        respuesta.usuario,
      );
      expect(service.usuario()).toEqual(respuesta.usuario);
      expect(service.estaAutenticado()).toBe(true);
      done();
    });
  });

  it('register guarda la sesión y actualiza el estado reactivo', (done) => {
    api.post.mockReturnValue(of(respuesta));

    service
      .register({ nombre: 'Admin', email: 'admin@pharmadash.com', password: 'password123', rol: Role.ADMINISTRADOR })
      .subscribe(() => {
        expect(tokenStorage.guardarSesion).toHaveBeenCalledWith(
          'token-falso',
          'refresh-falso',
          respuesta.usuario,
        );
        done();
      });
  });

  describe('refrescarToken', () => {
    it('lanza error si no hay refresh token guardado', (done) => {
      tokenStorage.obtenerRefreshToken.mockReturnValue(null);

      service.refrescarToken().subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('No hay refresh token disponible');
          expect(api.post).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('llama a /auth/refresh con el refresh token y actualiza la sesión', (done) => {
      tokenStorage.obtenerRefreshToken.mockReturnValue('refresh-guardado');
      api.post.mockReturnValue(of(respuesta));

      service.refrescarToken().subscribe((resultado) => {
        expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'refresh-guardado' });
        expect(resultado).toBe(respuesta);
        expect(tokenStorage.guardarSesion).toHaveBeenCalledWith(
          'token-falso',
          'refresh-falso',
          respuesta.usuario,
        );
        done();
      });
    });

    it('comparte la misma petición HTTP entre llamadas concurrentes', () => {
      tokenStorage.obtenerRefreshToken.mockReturnValue('refresh-guardado');
      const sujeto = new Subject<AuthResponse>();
      api.post.mockReturnValue(sujeto.asObservable());

      const observable1 = service.refrescarToken();
      const observable2 = service.refrescarToken();

      expect(observable1).toBe(observable2);
      expect(api.post).toHaveBeenCalledTimes(1);

      sujeto.next(respuesta);
      sujeto.complete();
    });

    it('libera la petición compartida cuando falla, permitiendo un nuevo intento', async () => {
      tokenStorage.obtenerRefreshToken.mockReturnValue('refresh-guardado');
      api.post.mockReturnValue(throwError(() => new Error('refresh inválido')));

      await expect(firstValueFrom(service.refrescarToken())).rejects.toThrow('refresh inválido');

      api.post.mockReturnValue(of(respuesta));
      const resultado = await firstValueFrom(service.refrescarToken());

      expect(api.post).toHaveBeenCalledTimes(2);
      expect(resultado).toBe(respuesta);
    });
  });

  describe('logout', () => {
    it('revoca el refresh token (best-effort), limpia la sesión y navega a /login', () => {
      tokenStorage.obtenerRefreshToken.mockReturnValue('refresh-guardado');
      api.post.mockReturnValue(of(undefined));

      service.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'refresh-guardado' });
      expect(tokenStorage.limpiarSesion).toHaveBeenCalled();
      expect(service.usuario()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('limpia la sesión local aunque la revocación en el backend falle', () => {
      tokenStorage.obtenerRefreshToken.mockReturnValue('refresh-guardado');
      api.post.mockReturnValue(throwError(() => new Error('red caída')));

      service.logout();

      expect(tokenStorage.limpiarSesion).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('no llama al backend si no hay refresh token guardado', () => {
      tokenStorage.obtenerRefreshToken.mockReturnValue(null);

      service.logout();

      expect(api.post).not.toHaveBeenCalled();
      expect(tokenStorage.limpiarSesion).toHaveBeenCalled();
    });
  });

  it('obtenerToken delega en el almacenamiento local', () => {
    tokenStorage.obtenerToken.mockReturnValue('token-guardado');

    expect(service.obtenerToken()).toBe('token-guardado');
  });
});
