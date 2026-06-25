import { Injectable } from '@nestjs/common';
import { Medicamento } from '../entities/medicamento.entity';
import { CrearMedicamentoDto } from '../dtos/crear-medicamento.dto';
import { ActualizarMedicamentoDto } from '../dtos/actualizar-medicamento.dto';

@Injectable()
export class MedicamentoFactory {
  crearDesdeDto(dto: CrearMedicamentoDto): Medicamento {
    const medicamento = new Medicamento();
    medicamento.nombre = dto.nombre;
    medicamento.categoria = dto.categoria;
    medicamento.sku = dto.sku;
    medicamento.precioUnitario = dto.precioUnitario;
    medicamento.stock = dto.stock;
    medicamento.fechaVencimiento = dto.fechaVencimiento;
    return medicamento;
  }

  aplicarActualizacion(medicamento: Medicamento, dto: ActualizarMedicamentoDto): Medicamento {
    if (dto.nombre !== undefined) medicamento.nombre = dto.nombre;
    if (dto.categoria !== undefined) medicamento.categoria = dto.categoria;
    if (dto.sku !== undefined) medicamento.sku = dto.sku;
    if (dto.precioUnitario !== undefined) medicamento.precioUnitario = dto.precioUnitario;
    if (dto.stock !== undefined) medicamento.stock = dto.stock;
    if (dto.fechaVencimiento !== undefined) medicamento.fechaVencimiento = dto.fechaVencimiento;
    return medicamento;
  }
}
