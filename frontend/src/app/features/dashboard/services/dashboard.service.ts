import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { KpiDashboard, MedicamentoAlerta, TopMedicamentoVendido } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly api: ApiService) {}

  obtenerKpis(): Observable<KpiDashboard> {
    return this.api.get<KpiDashboard>('/dashboard/kpis');
  }

  obtenerTop5(): Observable<TopMedicamentoVendido[]> {
    return this.api.get<TopMedicamentoVendido[]>('/dashboard/top5');
  }

  obtenerAlertas(): Observable<MedicamentoAlerta[]> {
    return this.api.get<MedicamentoAlerta[]>('/dashboard/alertas');
  }
}
