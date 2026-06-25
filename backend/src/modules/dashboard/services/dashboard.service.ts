import { Inject, Injectable } from '@nestjs/common';
import {
  IVentaRepository,
  TopMedicamentoVendido,
  VENTA_REPOSITORY,
} from '../../ventas/repositories/venta-repository.interface';
import {
  IMedicamentoRepository,
  MEDICAMENTO_REPOSITORY,
} from '../../medicamentos/repositories/medicamento-repository.interface';
import { MedicamentoAlertasService } from '../../medicamentos/services/medicamento-alertas.service';
import { mapearMedicamentoAResponse } from '../../medicamentos/mappers/medicamento.mapper';
import { MedicamentoResponseDto } from '../../medicamentos/dtos/medicamento-response.dto';
import { IDashboardService } from './dashboard-service.interface';
import { KpiDashboardDto } from '../dtos/kpi-dashboard.dto';

const LIMITE_ALERTAS = 6;

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject(VENTA_REPOSITORY)
    private readonly ventaRepository: IVentaRepository,
    @Inject(MEDICAMENTO_REPOSITORY)
    private readonly medicamentoRepository: IMedicamentoRepository,
    private readonly alertasService: MedicamentoAlertasService,
  ) {}

  async obtenerKpis(): Promise<KpiDashboardDto> {
    const [ingresosHoy, stockCriticoCount, vencimientoProximoCount, totalProductos] =
      await Promise.all([
        this.ventaRepository.obtenerIngresosDelDia(new Date()),
        this.medicamentoRepository.contarStockCritico(),
        this.medicamentoRepository.contarVencimientoProximo(),
        this.medicamentoRepository.contarTotal(),
      ]);

    return { ingresosHoy, stockCriticoCount, vencimientoProximoCount, totalProductos };
  }

  async obtenerTop5(): Promise<TopMedicamentoVendido[]> {
    return this.ventaRepository.obtenerTop5MasVendidos();
  }

  async obtenerAlertas(): Promise<MedicamentoResponseDto[]> {
    const medicamentos = await this.medicamentoRepository.findConAlertas(LIMITE_ALERTAS);
    return medicamentos.map((medicamento) =>
      mapearMedicamentoAResponse(medicamento, this.alertasService),
    );
  }
}
