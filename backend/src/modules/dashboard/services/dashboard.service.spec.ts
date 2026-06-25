import { DashboardService } from './dashboard.service';
import { MedicamentoAlertasService } from '../../medicamentos/services/medicamento-alertas.service';
import { IVentaRepository } from '../../ventas/repositories/venta-repository.interface';
import { IMedicamentoRepository } from '../../medicamentos/repositories/medicamento-repository.interface';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';

function crearMedicamento(id: string, nombre: string, stock: number): Medicamento {
  const medicamento = new Medicamento();
  medicamento.id = id;
  medicamento.nombre = nombre;
  medicamento.categoria = 'Analgésicos';
  medicamento.sku = `SKU-${id}`;
  medicamento.precioUnitario = 5;
  medicamento.stock = stock;
  medicamento.fechaVencimiento = '2026-12-01';
  return medicamento;
}

describe('DashboardService', () => {
  let ventaRepository: jest.Mocked<IVentaRepository>;
  let medicamentoRepository: jest.Mocked<IMedicamentoRepository>;
  let service: DashboardService;

  beforeEach(() => {
    ventaRepository = {
      crearTransaccional: jest.fn(),
      obtenerIngresosDelDia: jest.fn(),
      obtenerTop5MasVendidos: jest.fn(),
    };

    medicamentoRepository = {
      findAllPaginado: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      contarStockCritico: jest.fn(),
      contarVencimientoProximo: jest.fn(),
      contarTotal: jest.fn(),
      findConAlertas: jest.fn(),
      findCategoriasDistintas: jest.fn(),
    };

    service = new DashboardService(
      ventaRepository,
      medicamentoRepository,
      new MedicamentoAlertasService(),
    );
  });

  it('obtenerKpis combina los 4 indicadores en paralelo', async () => {
    ventaRepository.obtenerIngresosDelDia.mockResolvedValue(150.5);
    medicamentoRepository.contarStockCritico.mockResolvedValue(3);
    medicamentoRepository.contarVencimientoProximo.mockResolvedValue(2);
    medicamentoRepository.contarTotal.mockResolvedValue(20);

    const resultado = await service.obtenerKpis();

    expect(resultado).toEqual({
      ingresosHoy: 150.5,
      stockCriticoCount: 3,
      vencimientoProximoCount: 2,
      totalProductos: 20,
    });
  });

  it('obtenerTop5 delega en el repositorio de ventas', async () => {
    const top5 = [{ medicamentoId: 'med-1', nombre: 'Paracetamol', totalVendido: 5 }];
    ventaRepository.obtenerTop5MasVendidos.mockResolvedValue(top5);

    const resultado = await service.obtenerTop5();

    expect(resultado).toBe(top5);
  });

  it('obtenerAlertas mapea los medicamentos a DTO de respuesta', async () => {
    medicamentoRepository.findConAlertas.mockResolvedValue([crearMedicamento('med-1', 'Paracetamol', 3)]);

    const resultado = await service.obtenerAlertas();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Paracetamol');
    expect(resultado[0].stockCritico).toBe(true);
  });
});
