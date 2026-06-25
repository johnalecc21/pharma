import jwtConfig from './jwt.config';

describe('jwtConfig', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('usa los valores de las variables de entorno cuando están definidas', () => {
    process.env.JWT_SECRET = 'super-secreto';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_DIAS = '3';

    expect(jwtConfig()).toEqual({ secret: 'super-secreto', expiresIn: '1h', refreshTokenDias: 3 });
  });

  it('usa valores por defecto cuando las variables no están definidas', () => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.JWT_REFRESH_DIAS;

    expect(jwtConfig()).toEqual({ secret: 'dev-secret', expiresIn: '15m', refreshTokenDias: 7 });
  });
});
