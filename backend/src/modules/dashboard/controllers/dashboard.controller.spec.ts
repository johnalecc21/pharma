import { DashboardController } from './dashboard.controller';
import { IDashboardService } from '../services/dashboard-service.interface';

describe('DashboardController', () => {
  let service: jest.Mocked<IDashboardService>;
  let controller: DashboardController;

  beforeEach(() => {
    service = {
      obtenerKpis: jest.fn(),
      obtenerTop5: jest.fn(),
      obtenerAlertas: jest.fn(),
    };
    controller = new DashboardController(service);
  });

  it('obtenerKpis delega en el servicio', async () => {
    const kpis = { ingresosHoy: 100, stockCriticoCount: 1, vencimientoProximoCount: 2, totalProductos: 10 };
    service.obtenerKpis.mockResolvedValue(kpis);

    const resultado = await controller.obtenerKpis();

    expect(resultado).toBe(kpis);
  });

  it('obtenerTop5 delega en el servicio', async () => {
    const top5 = [{ medicamentoId: 'med-1', nombre: 'Paracetamol', totalVendido: 5 }];
    service.obtenerTop5.mockResolvedValue(top5);

    const resultado = await controller.obtenerTop5();

    expect(resultado).toBe(top5);
  });

  it('obtenerAlertas delega en el servicio', async () => {
    service.obtenerAlertas.mockResolvedValue([]);

    const resultado = await controller.obtenerAlertas();

    expect(resultado).toEqual([]);
  });
});
