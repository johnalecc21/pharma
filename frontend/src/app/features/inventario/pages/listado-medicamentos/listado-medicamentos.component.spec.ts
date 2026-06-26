import { of } from 'rxjs';
import { ListadoMedicamentosComponent } from './listado-medicamentos.component';
import { MedicamentoListadoService } from '../../state/medicamento-listado.service';
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
  let listado: MedicamentoListadoService;
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

    listado = new MedicamentoListadoService(medicamentoService);
    component = new ListadoMedicamentosComponent(listado);
  });

  it('ngOnInit inicializa el listado (categorías y medicamentos)', () => {
    component.ngOnInit();

    expect(listado.categorias()).toEqual(['Analgésicos']);
    expect(listado.medicamentos()).toHaveLength(1);
    expect(listado.total()).toBe(1);
    expect(listado.cargando()).toBe(false);
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

  it('guardadoExitoso cierra el modal y recarga el listado', () => {
    component.abrirNuevo();

    component.guardadoExitoso();

    expect(component.modalAbierto()).toBeNull();
    expect(medicamentoService.listar).toHaveBeenCalled();
  });

  it('eliminar no llama al servicio de listado si el usuario cancela la confirmación', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.eliminar(crearMedicamento('med-1'));

    expect(medicamentoService.eliminar).not.toHaveBeenCalled();
  });

  it('eliminar delega en el servicio de listado si el usuario confirma', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.eliminar(crearMedicamento('med-1'));

    expect(medicamentoService.eliminar).toHaveBeenCalledWith('med-1');
  });
});
