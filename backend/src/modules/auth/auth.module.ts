import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfig } from '../../config/jwt.config';
import { RefreshToken } from './entities/refresh-token.entity';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token-repository.interface';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  imports: [
    UsuariosModule,
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const jwtConfig = configService.get<JwtConfig>('jwt') as JwtConfig;
        const expiresIn = jwtConfig.expiresIn as NonNullable<
          JwtModuleOptions['signOptions']
        >['expiresIn'];
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {}
