import { ConflictException } from '@nestjs/common';

export class SkuDuplicadoException extends ConflictException {
  constructor(sku: string) {
    super(`El SKU "${sku}" ya está registrado`);
  }
}
