import { VentaService } from './venta.service';
import { StockValidatorService } from './stock-validator.service';
import { IVentaRepository } from '../repositories/venta-repository.interface';
import { IMedicamentoRepository } from '../../medicamentos/repositories/medicamento-repository.interface';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { Venta } from '../entities/venta.entity';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { StockInsuficienteException } from '../../../common/exceptions/stock-insuficiente.exception';

function crearMedicamento(id: string, nombre: string, stock: number, precio: number): Medicamento {
  const medicamento = new Medicamento();
  medicamento.id = id;
  medicamento.nombre = nombre;
  medicamento.stock = stock;
  medicamento.precioUnitario = precio;
  return medicamento;
}

describe('VentaService', () => {
  let ventaRepository: jest.Mocked<IVentaRepository>;
  let medicamentoRepository: jest.Mocked<IMedicamentoRepository>;
  let service: VentaService;

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

    service = new VentaService(
      ventaRepository,
      medicamentoRepository,
      new StockValidatorService(),
    );
  });

  it('procesa la venta y delega la atomicidad al repositorio (RN-02)', async () => {
    const medicamento = crearMedicamento('med-1', 'Paracetamol', 20, 5.5);
    medicamentoRepository.findById.mockResolvedValue(medicamento);

    const venta = new Venta();
    venta.id = 'venta-1';
    venta.fecha = new Date();
    venta.total = 27.5;
    const detalle = new DetalleVenta();
    detalle.medicamentoId = 'med-1';
    detalle.cantidad = 5;
    detalle.precioUnitarioSnapshot = 5.5;
    detalle.subtotal = 27.5;
    venta.detalles = [detalle];
    ventaRepository.crearTransaccional.mockResolvedValue(venta);

    const resultado = await service.procesarVenta('usuario-1', {
      items: [{ medicamentoId: 'med-1', cantidad: 5 }],
    });

    expect(ventaRepository.crearTransaccional).toHaveBeenCalledWith('usuario-1', [
      { medicamentoId: 'med-1', cantidad: 5 },
    ]);
    expect(resultado.total).toBe(27.5);
    expect(resultado.detalles[0].nombre).toBe('Paracetamol');
  });

  it('no llama al repositorio transaccional si el stock es insuficiente (rollback preventivo)', async () => {
    const medicamento = crearMedicamento('med-1', 'Paracetamol', 2, 5.5);
    medicamentoRepository.findById.mockResolvedValue(medicamento);

    await expect(
      service.procesarVenta('usuario-1', {
        items: [{ medicamentoId: 'med-1', cantidad: 10 }],
      }),
    ).rejects.toThrow(StockInsuficienteException);

    expect(ventaRepository.crearTransaccional).not.toHaveBeenCalled();
  });
});
