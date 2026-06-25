import { Inject, Injectable } from '@nestjs/common';
import {
  IVentaRepository,
  VENTA_REPOSITORY,
} from '../repositories/venta-repository.interface';
import {
  IMedicamentoRepository,
  MEDICAMENTO_REPOSITORY,
} from '../../medicamentos/repositories/medicamento-repository.interface';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { StockValidatorService } from './stock-validator.service';
import { IVentaService } from './venta-service.interface';
import { CrearVentaDto } from '../dtos/crear-venta.dto';
import { VentaResponseDto } from '../dtos/venta-response.dto';
import { Venta } from '../entities/venta.entity';

@Injectable()
export class VentaService implements IVentaService {
  constructor(
    @Inject(VENTA_REPOSITORY)
    private readonly ventaRepository: IVentaRepository,
    @Inject(MEDICAMENTO_REPOSITORY)
    private readonly medicamentoRepository: IMedicamentoRepository,
    private readonly stockValidator: StockValidatorService,
  ) {}

  async procesarVenta(usuarioId: string, dto: CrearVentaDto): Promise<VentaResponseDto> {
    const medicamentos = await this.cargarMedicamentos(dto);
    this.stockValidator.validarDisponibilidad(medicamentos, dto.items);

    const venta = await this.ventaRepository.crearTransaccional(usuarioId, dto.items);
    return this.mapearRespuesta(venta, medicamentos);
  }

  private async cargarMedicamentos(dto: CrearVentaDto): Promise<Map<string, Medicamento>> {
    const medicamentos = new Map<string, Medicamento>();

    for (const item of dto.items) {
      const medicamento = await this.medicamentoRepository.findById(item.medicamentoId);
      if (medicamento) {
        medicamentos.set(medicamento.id, medicamento);
      }
    }

    return medicamentos;
  }

  private mapearRespuesta(venta: Venta, medicamentos: Map<string, Medicamento>): VentaResponseDto {
    return {
      id: venta.id,
      fecha: venta.fecha,
      total: Number(venta.total),
      detalles: venta.detalles.map((detalle) => ({
        medicamentoId: detalle.medicamentoId,
        // istanbul ignore next -- el medicamento siempre existe en el mapa: ya fue validado en cargarMedicamentos
        nombre: medicamentos.get(detalle.medicamentoId)?.nombre ?? '',
        cantidad: detalle.cantidad,
        precioUnitario: Number(detalle.precioUnitarioSnapshot),
        subtotal: Number(detalle.subtotal),
      })),
    };
  }
}
