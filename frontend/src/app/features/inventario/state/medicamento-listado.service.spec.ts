import { of, throwError } from 'rxjs';
import { MedicamentoListadoService } from './medicamento-listado.service';
import { MedicamentoService } from '../services/medicamento.service';
import { Medicamento } from '../models/medicamento.model';

function crearMedicamento(id: string): Medicamento {
  return {
    id,
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
}

describe('MedicamentoListadoService', () => {
  let medicamentoService: jest.Mocked<MedicamentoService>;
  let service: MedicamentoListadoService;
  const paginado = { data: [crearMedicamento('med-1')], total: 1, pagina: 1, limite: 8, totalPaginas: 1 };

  beforeEach(() => {
    medicamentoService = {
      listar: jest.fn().mockReturnValue(of(paginado)),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn().mockReturnValue(of(undefined)),
      listarCategorias: jest.fn().mockReturnValue(of(['Analgésicos'])),
    } as unknown as jest.Mocked<MedicamentoService>;

    service = new MedicamentoListadoService(medicamentoService);
  });

  it('inicializar carga categorías y medicamentos', () => {
    service.inicializar();

    expect(service.categorias()).toEqual(['Analgésicos']);
    expect(service.medicamentos()).toHaveLength(1);
    expect(service.total()).toBe(1);
    expect(service.cargando()).toBe(false);
  });

  it('marca cargando en false si la carga falla', () => {
    medicamentoService.listar.mockReturnValue(throwError(() => new Error('fallo')));

    service.cargar();

    expect(service.cargando()).toBe(false);
  });

  it('buscar reinicia a la página 1 y recarga', () => {
    service.pagina.set(3);

    service.buscar();

    expect(service.pagina()).toBe(1);
    expect(medicamentoService.listar).toHaveBeenCalled();
  });

  it('seleccionarCategoria actualiza el filtro y recarga desde la página 1', () => {
    service.seleccionarCategoria('Analgésicos');

    expect(service.categoriaActiva()).toBe('Analgésicos');
    expect(medicamentoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Analgésicos', pagina: 1 }),
    );
  });

  it('irAPagina cambia de página y recarga', () => {
    service.irAPagina(2);

    expect(service.pagina()).toBe(2);
    expect(medicamentoService.listar).toHaveBeenCalledWith(expect.objectContaining({ pagina: 2 }));
  });

  it('eliminar llama al servicio HTTP y recarga el listado', () => {
    service.eliminar(crearMedicamento('med-1'));

    expect(medicamentoService.eliminar).toHaveBeenCalledWith('med-1');
    expect(medicamentoService.listar).toHaveBeenCalled();
  });
});
