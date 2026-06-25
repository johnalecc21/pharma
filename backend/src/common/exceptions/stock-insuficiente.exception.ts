import { UnprocessableEntityException } from '@nestjs/common';

export class StockInsuficienteException extends UnprocessableEntityException {
  constructor(nombreMedicamento: string, disponible: number, solicitado: number) {
    super(
      `Stock insuficiente para "${nombreMedicamento}": disponible ${disponible}, solicitado ${solicitado}`,
    );
  }
}
