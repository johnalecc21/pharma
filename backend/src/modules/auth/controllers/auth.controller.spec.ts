import { AuthController } from './auth.controller';
import { IAuthService } from '../services/auth-service.interface';
import { Role } from '../../../common/enums/role.enum';
import { AuthResponseDto } from '../dtos/auth-response.dto';

describe('AuthController', () => {
  let authService: jest.Mocked<IAuthService>;
  let controller: AuthController;

  const respuesta: AuthResponseDto = {
    accessToken: 'token-falso',
    refreshToken: 'refresh-falso',
    usuario: { id: '1', nombre: 'Admin', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR },
  };

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refrescarToken: jest.fn(),
      revocarToken: jest.fn(),
    };
    controller = new AuthController(authService);
  });

  it('register delega en el servicio y retorna su resultado', async () => {
    authService.register.mockResolvedValue(respuesta);

    const dto = { nombre: 'Admin', email: 'admin@pharmadash.com', password: 'password123', rol: Role.ADMINISTRADOR };
    const resultado = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(resultado).toBe(respuesta);
  });

  it('login delega en el servicio y retorna su resultado', async () => {
    authService.login.mockResolvedValue(respuesta);

    const dto = { email: 'admin@pharmadash.com', password: 'password123' };
    const resultado = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(resultado).toBe(respuesta);
  });

  it('refrescar delega en el servicio con el refreshToken recibido', async () => {
    authService.refrescarToken.mockResolvedValue(respuesta);

    const resultado = await controller.refrescar({ refreshToken: 'refresh-falso' });

    expect(authService.refrescarToken).toHaveBeenCalledWith('refresh-falso');
    expect(resultado).toBe(respuesta);
  });

  it('logout delega en el servicio con el refreshToken recibido', async () => {
    authService.revocarToken.mockResolvedValue(undefined);

    await controller.logout({ refreshToken: 'refresh-falso' });

    expect(authService.revocarToken).toHaveBeenCalledWith('refresh-falso');
  });
});
