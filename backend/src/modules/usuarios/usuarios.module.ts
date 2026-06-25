import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { USUARIO_REPOSITORY } from './repositories/usuario-repository.interface';
import { UsuarioRepository } from './repositories/usuario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioRepository,
    },
  ],
  exports: [USUARIO_REPOSITORY],
})
export class UsuariosModule {}
