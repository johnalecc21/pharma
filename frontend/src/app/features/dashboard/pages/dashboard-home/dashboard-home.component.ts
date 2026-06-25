import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { KpiDashboard, MedicamentoAlerta, TopMedicamentoVendido } from '../../models/dashboard.model';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card.component';
import { Top5ChartComponent } from '../../components/top5-chart/top5-chart.component';
import { AlertasInventarioComponent } from '../../components/alertas-inventario/alertas-inventario.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DecimalPipe, KpiCardComponent, Top5ChartComponent, AlertasInventarioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {
  readonly kpis = signal<KpiDashboard | null>(null);
  readonly top5 = signal<TopMedicamentoVendido[]>([]);
  readonly alertas = signal<MedicamentoAlerta[]>([]);

  constructor(
    readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.obtenerKpis().subscribe((kpis) => this.kpis.set(kpis));
    this.dashboardService.obtenerTop5().subscribe((top5) => this.top5.set(top5));
    this.dashboardService.obtenerAlertas().subscribe((alertas) => this.alertas.set(alertas));
  }
}
