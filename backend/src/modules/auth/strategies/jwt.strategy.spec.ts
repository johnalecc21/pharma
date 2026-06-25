import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { Role } from '../../../common/enums/role.enum';

describe('JwtStrategy', () => {
  it('validate retorna el payload decodificado del token tal cual', () => {
    const configService = {
      get: jest.fn().mockReturnValue({ secret: 'dev-secret', expiresIn: '8h' }),
    } as unknown as ConfigService;

    const strategy = new JwtStrategy(configService);
    const payload = { sub: 'usuario-1', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR };

    expect(strategy.validate(payload)).toBe(payload);
  });
});
