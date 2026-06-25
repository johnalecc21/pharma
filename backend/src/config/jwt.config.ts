import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshTokenDias: number;
}

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET ?? 'dev-secret',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  refreshTokenDias: Number(process.env.JWT_REFRESH_DIAS) || 7,
}));
