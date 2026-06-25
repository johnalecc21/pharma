import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IUsuarioRepository } from '../../usuarios/repositories/usuario-repository.interface';
import { IRefreshTokenRepository } from '../repositories/refresh-token-repository.interface';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from '../../../common/enums/role.enum';
import { CredencialesInvalidasException } from '../../../common/exceptions/credenciales-invalidas.exception';
import { EmailDuplicadoException } from '../../../common/exceptions/email-duplicado.exception';
import { RefreshTokenInvalidoException } from '../../../common/exceptions/refresh-token-invalido.exception';
import { hashearToken } from '../utils/token-hash.util';

describe('AuthService', () => {
  let usuarioRepository: jest.Mocked<IUsuarioRepository>;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let service: AuthService;

  beforeEach(() => {
    usuarioRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    refreshTokenRepository = {
      crear: jest.fn().mockImplementation(async (token) => token),
      findByTokenHash: jest.fn(),
      revocar: jest.fn(),
      revocarTodosDeUsuario: jest.fn(),
    };

    jwtService = { sign: jest.fn().mockReturnValue('token-falso') } as unknown as jest.Mocked<JwtService>;
    configService = {
      get: jest.fn().mockReturnValue({ secret: 'dev-secret', expiresIn: '15m', refreshTokenDias: 7 }),
    } as unknown as jest.Mocked<ConfigService>;

    service = new AuthService(usuarioRepository, refreshTokenRepository, jwtService, configService);
  });

  describe('register', () => {
    it('crea el usuario y emite un refresh token cuando el email no existe', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);
      usuarioRepository.save.mockImplementation(async (usuario) => {
        usuario.id = 'usuario-1';
        return usuario;
      });

      const resultado = await service.register({
        nombre: 'Admin',
        email: 'admin@pharmadash.com',
        password: 'password123',
        rol: Role.ADMINISTRADOR,
      });

      expect(resultado.accessToken).toBe('token-falso');
      expect(resultado.refreshToken).toHaveLength(128);
      expect(resultado.usuario.email).toBe('admin@pharmadash.com');
      expect(refreshTokenRepository.crear).toHaveBeenCalled();
    });

    it('lanza EmailDuplicadoException si el email ya existe', async () => {
      const existente = new Usuario();
      existente.email = 'admin@pharmadash.com';
      usuarioRepository.findByEmail.mockResolvedValue(existente);

      await expect(
        service.register({
          nombre: 'Admin',
          email: 'admin@pharmadash.com',
          password: 'password123',
          rol: Role.ADMINISTRADOR,
        }),
      ).rejects.toThrow(EmailDuplicadoException);

      expect(usuarioRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('retorna accessToken y refreshToken cuando las credenciales son correctas', async () => {
      const usuario = new Usuario();
      usuario.id = 'usuario-1';
      usuario.email = 'admin@pharmadash.com';
      usuario.activo = true;
      usuario.rol = Role.ADMINISTRADOR;
      usuario.passwordHash = await bcrypt.hash('password123', 4);
      usuarioRepository.findByEmail.mockResolvedValue(usuario);

      const resultado = await service.login({
        email: 'admin@pharmadash.com',
        password: 'password123',
      });

      expect(resultado.accessToken).toBe('token-falso');
      expect(resultado.refreshToken).toBeDefined();
    });

    it('lanza CredencialesInvalidasException con password incorrecta', async () => {
      const usuario = new Usuario();
      usuario.activo = true;
      usuario.passwordHash = await bcrypt.hash('password123', 4);
      usuarioRepository.findByEmail.mockResolvedValue(usuario);

      await expect(
        service.login({ email: 'admin@pharmadash.com', password: 'incorrecta' }),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('lanza CredencialesInvalidasException si el usuario no existe', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nadie@pharmadash.com', password: 'cualquiera' }),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('lanza CredencialesInvalidasException si el usuario está inactivo', async () => {
      const usuario = new Usuario();
      usuario.activo = false;
      usuario.passwordHash = await bcrypt.hash('password123', 4);
      usuarioRepository.findByEmail.mockResolvedValue(usuario);

      await expect(
        service.login({ email: 'admin@pharmadash.com', password: 'password123' }),
      ).rejects.toThrow(CredencialesInvalidasException);
    });
  });

  describe('refrescarToken', () => {
    function crearRefreshTokenGuardado(usuarioId: string, expiraEn: Date): RefreshToken {
      const token = new RefreshToken();
      token.id = 'refresh-1';
      token.usuarioId = usuarioId;
      token.tokenHash = hashearToken('token-plano');
      token.expiraEn = expiraEn;
      return token;
    }

    it('rota el refresh token y emite nuevas credenciales', async () => {
      const usuario = new Usuario();
      usuario.id = 'usuario-1';
      usuario.activo = true;
      usuario.rol = Role.ADMINISTRADOR;

      const tokenGuardado = crearRefreshTokenGuardado('usuario-1', new Date(Date.now() + 1000 * 60));
      refreshTokenRepository.findByTokenHash.mockResolvedValue(tokenGuardado);
      usuarioRepository.findById.mockResolvedValue(usuario);

      const resultado = await service.refrescarToken('token-plano');

      expect(refreshTokenRepository.revocar).toHaveBeenCalledWith('refresh-1');
      expect(resultado.accessToken).toBe('token-falso');
      expect(resultado.refreshToken).toBeDefined();
    });

    it('lanza RefreshTokenInvalidoException si el token no existe', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(service.refrescarToken('token-invalido')).rejects.toThrow(
        RefreshTokenInvalidoException,
      );
    });

    it('lanza RefreshTokenInvalidoException si el token ya expiró', async () => {
      const tokenGuardado = crearRefreshTokenGuardado('usuario-1', new Date(Date.now() - 1000));
      refreshTokenRepository.findByTokenHash.mockResolvedValue(tokenGuardado);

      await expect(service.refrescarToken('token-plano')).rejects.toThrow(
        RefreshTokenInvalidoException,
      );
    });

    it('lanza RefreshTokenInvalidoException si el usuario fue desactivado', async () => {
      const tokenGuardado = crearRefreshTokenGuardado('usuario-1', new Date(Date.now() + 1000 * 60));
      refreshTokenRepository.findByTokenHash.mockResolvedValue(tokenGuardado);
      usuarioRepository.findById.mockResolvedValue(null);

      await expect(service.refrescarToken('token-plano')).rejects.toThrow(
        RefreshTokenInvalidoException,
      );
    });
  });

  describe('revocarToken', () => {
    it('revoca el refresh token si existe', async () => {
      const token = new RefreshToken();
      token.id = 'refresh-1';
      refreshTokenRepository.findByTokenHash.mockResolvedValue(token);

      await service.revocarToken('token-plano');

      expect(refreshTokenRepository.revocar).toHaveBeenCalledWith('refresh-1');
    });

    it('no lanza error si el token no existe (logout idempotente)', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(service.revocarToken('token-inexistente')).resolves.toBeUndefined();
      expect(refreshTokenRepository.revocar).not.toHaveBeenCalled();
    });
  });
});
