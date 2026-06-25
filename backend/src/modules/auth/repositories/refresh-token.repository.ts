import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { IRefreshTokenRepository } from './refresh-token-repository.interface';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async crear(refreshToken: RefreshToken): Promise<RefreshToken> {
    return this.repository.save(refreshToken);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repository.findOne({ where: { tokenHash, revocadoEn: IsNull() } });
  }

  async revocar(id: string): Promise<void> {
    await this.repository.update(id, { revocadoEn: new Date() });
  }

  async revocarTodosDeUsuario(usuarioId: string): Promise<void> {
    await this.repository.update({ usuarioId, revocadoEn: IsNull() }, { revocadoEn: new Date() });
  }
}
