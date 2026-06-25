import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { IUsuarioRepository } from './usuario-repository.interface';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id } });
  }

  async save(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario);
  }
}
