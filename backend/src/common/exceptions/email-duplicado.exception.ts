import { ConflictException } from '@nestjs/common';

export class EmailDuplicadoException extends ConflictException {
  constructor(email: string) {
    super(`El email "${email}" ya está registrado`);
  }
}
