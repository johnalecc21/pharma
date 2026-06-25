import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'pharmadash_token';
const REFRESH_TOKEN_KEY = 'pharmadash_refresh_token';
const USER_KEY = 'pharmadash_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  guardarSesion(token: string, refreshToken: string, usuario: Usuario): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  obtenerRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  obtenerUsuario(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }

  limpiarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
