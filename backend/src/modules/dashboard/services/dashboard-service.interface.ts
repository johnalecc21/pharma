import { KpiDashboardDto } from '../dtos/kpi-dashboard.dto';
import { TopMedicamentoVendido } from '../../ventas/repositories/venta-repository.interface';
import { MedicamentoResponseDto } from '../../medicamentos/dtos/medicamento-response.dto';

export interface IDashboardService {
  obtenerKpis(): Promise<KpiDashboardDto>;
  obtenerTop5(): Promise<TopMedicamentoVendido[]>;
  obtenerAlertas(): Promise<MedicamentoResponseDto[]>;
}
