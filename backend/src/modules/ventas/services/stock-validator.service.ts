import { Injectable, NotFoundException } from '@nestjs/common';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { ItemVentaDto } from '../dtos/item-venta.dto';
import { StockInsuficienteException } from '../../../common/exceptions/stock-insuficiente.exception';

@Injectable()
export class StockValidatorService {
  validarDisponibilidad(medicamentos: Map<string, Medicamento>, items: ItemVentaDto[]): void {
    for (const item of items) {
      const medicamento = medicamentos.get(item.medicamentoId);

      if (!medicamento) {
        throw new NotFoundException(
          `Medicamento con id "${item.medicamentoId}" no encontrado`,
        );
      }

      if (medicamento.stock < item.cantidad) {
        throw new StockInsuficienteException(
          medicamento.nombre,
          medicamento.stock,
          item.cantidad,
        );
      }
    }
  }
}
