import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenInvalidoException extends UnauthorizedException {
  constructor() {
    super('El refresh token es inválido, expiró o ya fue revocado');
  }
}
