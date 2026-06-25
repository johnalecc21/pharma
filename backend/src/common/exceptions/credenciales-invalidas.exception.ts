import { UnauthorizedException } from '@nestjs/common';

export class CredencialesInvalidasException extends UnauthorizedException {
  constructor() {
    super('Email o contraseña incorrectos');
  }
}
