import { Role } from './role.enum';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: Role;
}
