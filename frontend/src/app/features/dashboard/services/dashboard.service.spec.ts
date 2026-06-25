import { of } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { ApiService } from '../../../core/services/api.service';

describe('DashboardService', () => {
  let api: jest.Mocked<ApiService>;
  let service: DashboardService;

  beforeEach(() => {
    api = { get: jest.fn().mockReturnValue(of(null)) } as unknown as jest.Mocked<ApiService>;
    service = new DashboardService(api);
  });

  it('obtenerKpis consulta /dashboard/kpis', () => {
    service.obtenerKpis().subscribe();
    expect(api.get).toHaveBeenCalledWith('/dashboard/kpis');
  });

  it('obtenerTop5 consulta /dashboard/top5', () => {
    service.obtenerTop5().subscribe();
    expect(api.get).toHaveBeenCalledWith('/dashboard/top5');
  });

  it('obtenerAlertas consulta /dashboard/alertas', () => {
    service.obtenerAlertas().subscribe();
    expect(api.get).toHaveBeenCalledWith('/dashboard/alertas');
  });
});
