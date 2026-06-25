import { Usuario } from '../entities/usuario.entity';

export interface IUsuarioRepository {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<Usuario>;
}

export const USUARIO_REPOSITORY = Symbol('USUARIO_REPOSITORY');
