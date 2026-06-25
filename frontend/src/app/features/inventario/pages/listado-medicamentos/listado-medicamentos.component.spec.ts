import { of, throwError } from 'rxjs';
import { ListadoMedicamentosComponent } from './listado-medicamentos.component';
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../models/medicamento.model';

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

describe('ListadoMedicamentosComponent', () => {
  let medicamentoService: jest.Mocked<MedicamentoService>;
  let component: ListadoMedicamentosComponent;
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

    component = new ListadoMedicamentosComponent(medicamentoService);
  });

  it('ngOnInit carga categorías y medicamentos', () => {
    component.ngOnInit();

    expect(component.categorias()).toEqual(['Analgésicos']);
    expect(component.medicamentos()).toHaveLength(1);
    expect(component.total()).toBe(1);
    expect(component.cargando()).toBe(false);
  });

  it('marca cargando en false si la carga falla', () => {
    medicamentoService.listar.mockReturnValue(throwError(() => new Error('fallo')));

    component.ngOnInit();

    expect(component.cargando()).toBe(false);
  });

  it('buscar reinicia a la página 1 y recarga', () => {
    component.pagina.set(3);

    component.buscar();

    expect(component.pagina()).toBe(1);
    expect(medicamentoService.listar).toHaveBeenCalled();
  });

  it('seleccionarCategoria actualiza el filtro y recarga desde la página 1', () => {
    component.seleccionarCategoria('Analgésicos');

    expect(component.categoriaActiva()).toBe('Analgésicos');
    expect(medicamentoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Analgésicos', pagina: 1 }),
    );
  });

  it('irAPagina cambia de página y recarga', () => {
    component.irAPagina(2);

    expect(component.pagina()).toBe(2);
    expect(medicamentoService.listar).toHaveBeenCalledWith(expect.objectContaining({ pagina: 2 }));
  });

  it('abrirNuevo y cerrarModal controlan el estado del modal', () => {
    component.abrirNuevo();
    expect(component.modalAbierto()).toBe('nuevo');
    expect(component.medicamentoIdEnEdicion).toBeNull();

    component.cerrarModal();
    expect(component.modalAbierto()).toBeNull();
  });

  it('abrirEditar guarda el id del medicamento en edición', () => {
    component.abrirEditar(crearMedicamento('med-1'));

    expect(component.modalAbierto()).toBe('med-1');
    expect(component.medicamentoIdEnEdicion).toBe('med-1');
  });

  it('guardadoExitoso cierra el modal y recarga', () => {
    component.abrirNuevo();

    component.guardadoExitoso();

    expect(component.modalAbierto()).toBeNull();
    expect(medicamentoService.listar).toHaveBeenCalled();
  });

  it('eliminar no llama al servicio si el usuario cancela la confirmación', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.eliminar(crearMedicamento('med-1'));

    expect(medicamentoService.eliminar).not.toHaveBeenCalled();
  });

  it('eliminar llama al servicio y recarga si el usuario confirma', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.eliminar(crearMedicamento('med-1'));

    expect(medicamentoService.eliminar).toHaveBeenCalledWith('med-1');
  });
});
