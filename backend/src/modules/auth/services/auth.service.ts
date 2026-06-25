import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  IUsuarioRepository,
  USUARIO_REPOSITORY,
} from '../../usuarios/repositories/usuario-repository.interface';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { IAuthService } from './auth-service.interface';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { CredencialesInvalidasException } from '../../../common/exceptions/credenciales-invalidas.exception';
import { EmailDuplicadoException } from '../../../common/exceptions/email-duplicado.exception';
import { RefreshTokenInvalidoException } from '../../../common/exceptions/refresh-token-invalido.exception';
import { JwtPayload } from '../../../common/interfaces/authenticated-request.interface';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../repositories/refresh-token-repository.interface';
import { RefreshToken } from '../entities/refresh-token.entity';
import { generarTokenAleatorio, hashearToken } from '../utils/token-hash.util';
import { JwtConfig } from '../../../config/jwt.config';

const SALT_ROUNDS = 10;
const MS_POR_DIA = 1000 * 60 * 60 * 24;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuarioRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existente = await this.usuarioRepository.findByEmail(dto.email);
    if (existente) {
      throw new EmailDuplicadoException(dto.email);
    }

    const usuario = new Usuario();
    usuario.nombre = dto.nombre;
    usuario.email = dto.email;
    usuario.rol = dto.rol;
    usuario.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    return this.construirRespuesta(usuarioGuardado);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const usuario = await this.usuarioRepository.findByEmail(dto.email);
    if (!usuario || !usuario.activo) {
      throw new CredencialesInvalidasException();
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new CredencialesInvalidasException();
    }

    return this.construirRespuesta(usuario);
  }

  async refrescarToken(refreshToken: string): Promise<AuthResponseDto> {
    const tokenHash = hashearToken(refreshToken);
    const tokenGuardado = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!tokenGuardado || tokenGuardado.expiraEn.getTime() < Date.now()) {
      throw new RefreshTokenInvalidoException();
    }

    const usuario = await this.usuarioRepository.findById(tokenGuardado.usuarioId);
    if (!usuario || !usuario.activo) {
      throw new RefreshTokenInvalidoException();
    }

    await this.refreshTokenRepository.revocar(tokenGuardado.id);
    return this.construirRespuesta(usuario);
  }

  async revocarToken(refreshToken: string): Promise<void> {
    const tokenHash = hashearToken(refreshToken);
    const tokenGuardado = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (tokenGuardado) {
      await this.refreshTokenRepository.revocar(tokenGuardado.id);
    }
  }

  private async construirRespuesta(usuario: Usuario): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const refreshToken = await this.emitirRefreshToken(usuario.id);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  private async emitirRefreshToken(usuarioId: string): Promise<string> {
    const jwtConfig = this.configService.get<JwtConfig>('jwt') as JwtConfig;
    const tokenPlano = generarTokenAleatorio();

    const refreshToken = new RefreshToken();
    refreshToken.usuarioId = usuarioId;
    refreshToken.tokenHash = hashearToken(tokenPlano);
    refreshToken.expiraEn = new Date(Date.now() + jwtConfig.refreshTokenDias * MS_POR_DIA);

    await this.refreshTokenRepository.crear(refreshToken);
    return tokenPlano;
  }
}
