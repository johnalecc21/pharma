import { TokenStorageService } from './token-storage.service';
import { Role } from '../models/role.enum';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new TokenStorageService();
  });

  it('retorna null cuando no hay sesión guardada', () => {
    expect(service.obtenerToken()).toBeNull();
    expect(service.obtenerRefreshToken()).toBeNull();
    expect(service.obtenerUsuario()).toBeNull();
  });

  it('guarda y recupera el access token, el refresh token y el usuario', () => {
    const usuario = { id: '1', nombre: 'Admin', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR };

    service.guardarSesion('token-falso', 'refresh-falso', usuario);

    expect(service.obtenerToken()).toBe('token-falso');
    expect(service.obtenerRefreshToken()).toBe('refresh-falso');
    expect(service.obtenerUsuario()).toEqual(usuario);
  });

  it('limpia la sesión completa', () => {
    const usuario = { id: '1', nombre: 'Admin', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR };
    service.guardarSesion('token-falso', 'refresh-falso', usuario);

    service.limpiarSesion();

    expect(service.obtenerToken()).toBeNull();
    expect(service.obtenerRefreshToken()).toBeNull();
    expect(service.obtenerUsuario()).toBeNull();
  });
});
