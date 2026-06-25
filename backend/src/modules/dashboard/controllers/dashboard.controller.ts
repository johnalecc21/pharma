import { Controller, Get, Inject } from '@nestjs/common';
import { IDashboardService } from '../services/dashboard-service.interface';
import { DashboardService } from '../services/dashboard.service';
import { KpiDashboardDto } from '../dtos/kpi-dashboard.dto';
import { TopMedicamentoVendido } from '../../ventas/repositories/venta-repository.interface';
import { MedicamentoResponseDto } from '../../medicamentos/dtos/medicamento-response.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: IDashboardService,
  ) {}

  @Get('kpis')
  async obtenerKpis(): Promise<KpiDashboardDto> {
    return this.dashboardService.obtenerKpis();
  }

  @Get('top5')
  async obtenerTop5(): Promise<TopMedicamentoVendido[]> {
    return this.dashboardService.obtenerTop5();
  }

  @Get('alertas')
  async obtenerAlertas(): Promise<MedicamentoResponseDto[]> {
    return this.dashboardService.obtenerAlertas();
  }
}
