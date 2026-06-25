import { MedicamentoController } from './medicamento.controller';
import { IMedicamentoService } from '../services/medicamento-service.interface';
import { MedicamentoResponseDto } from '../dtos/medicamento-response.dto';

describe('MedicamentoController', () => {
  let service: jest.Mocked<IMedicamentoService>;
  let controller: MedicamentoController;

  const medicamento: MedicamentoResponseDto = {
    id: 'med-1',
    nombre: 'Paracetamol',
    categoria: 'Analgésicos',
    sku: 'PARA500',
    precioUnitario: 5,
    stock: 20,
    fechaVencimiento: '2026-12-01',
    stockCritico: false,
    vencimientoProximo: false,
    diasParaVencer: 100,
  };

  beforeEach(() => {
    service = {
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      listarCategorias: jest.fn(),
    };
    controller = new MedicamentoController(service);
  });

  it('listar delega en el servicio con el filtro recibido', async () => {
    const paginado = { data: [medicamento], total: 1, pagina: 1, limite: 10, totalPaginas: 1 };
    service.listar.mockResolvedValue(paginado);

    const filtro = { pagina: 1, limite: 10 };
    const resultado = await controller.listar(filtro);

    expect(service.listar).toHaveBeenCalledWith(filtro);
    expect(resultado).toBe(paginado);
  });

  it('listarCategorias delega en el servicio', async () => {
    service.listarCategorias.mockResolvedValue(['Analgésicos']);

    const resultado = await controller.listarCategorias();

    expect(resultado).toEqual(['Analgésicos']);
  });

  it('obtenerPorId delega en el servicio con el id recibido', async () => {
    service.obtenerPorId.mockResolvedValue(medicamento);

    const resultado = await controller.obtenerPorId('med-1');

    expect(service.obtenerPorId).toHaveBeenCalledWith('med-1');
    expect(resultado).toBe(medicamento);
  });

  it('crear delega en el servicio con el dto recibido', async () => {
    service.crear.mockResolvedValue(medicamento);

    const dto = {
      nombre: 'Paracetamol',
      categoria: 'Analgésicos',
      sku: 'PARA500',
      precioUnitario: 5,
      stock: 20,
      fechaVencimiento: '2026-12-01',
    };
    const resultado = await controller.crear(dto);

    expect(service.crear).toHaveBeenCalledWith(dto);
    expect(resultado).toBe(medicamento);
  });

  it('actualizar delega en el servicio con id y dto', async () => {
    service.actualizar.mockResolvedValue(medicamento);

    const resultado = await controller.actualizar('med-1', { stock: 5 });

    expect(service.actualizar).toHaveBeenCalledWith('med-1', { stock: 5 });
    expect(resultado).toBe(medicamento);
  });

  it('eliminar delega en el servicio con el id recibido', async () => {
    service.eliminar.mockResolvedValue(undefined);

    await controller.eliminar('med-1');

    expect(service.eliminar).toHaveBeenCalledWith('med-1');
  });
});
