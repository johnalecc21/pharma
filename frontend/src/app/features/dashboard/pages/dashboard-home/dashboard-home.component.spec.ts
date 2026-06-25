import { of } from 'rxjs';
import { DashboardHomeComponent } from './dashboard-home.component';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('DashboardHomeComponent', () => {
  it('ngOnInit carga KPIs, top5 y alertas', () => {
    const dashboardService = {
      obtenerKpis: jest.fn().mockReturnValue(of({ ingresosHoy: 100, stockCriticoCount: 1, vencimientoProximoCount: 2, totalProductos: 10 })),
      obtenerTop5: jest.fn().mockReturnValue(of([{ medicamentoId: 'med-1', nombre: 'Paracetamol', totalVendido: 5 }])),
      obtenerAlertas: jest.fn().mockReturnValue(of([])),
    } as unknown as DashboardService;
    const authService = {} as AuthService;

    const component = new DashboardHomeComponent(authService, dashboardService);
    component.ngOnInit();

    expect(component.kpis()).toEqual({ ingresosHoy: 100, stockCriticoCount: 1, vencimientoProximoCount: 2, totalProductos: 10 });
    expect(component.top5()).toHaveLength(1);
    expect(component.alertas()).toEqual([]);
  });
});
