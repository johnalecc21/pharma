import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  crear(refreshToken: RefreshToken): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revocar(id: string): Promise<void>;
  revocarTodosDeUsuario(usuarioId: string): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');
