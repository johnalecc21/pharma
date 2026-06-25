import { of, throwError } from 'rxjs';
import { VentaRapidaComponent } from './venta-rapida.component';
import { MedicamentoService } from '../../../inventario/services/medicamento.service';
import { CarritoService } from '../../state/carrito.service';
import { VentaService } from '../../services/venta.service';
import { Medicamento } from '../../../inventario/models/medicamento.model';

function crearMedicamento(id: string, stock = 10): Medicamento {
  return {
    id,
    nombre: 'Paracetamol',
    categoria: 'Analgésicos',
    sku: 'PARA500',
    precioUnitario: 5,
    stock,
    fechaVencimiento: '2026-12-01',
    stockCritico: false,
    vencimientoProximo: false,
    diasParaVencer: 100,
  };
}

describe('VentaRapidaComponent', () => {
  let medicamentoService: jest.Mocked<MedicamentoService>;
  let ventaService: jest.Mocked<VentaService>;
  let carrito: CarritoService;
  let component: VentaRapidaComponent;
  const paginado = { data: [crearMedicamento('med-1')], total: 1, pagina: 1, limite: 12, totalPaginas: 1 };

  beforeEach(() => {
    medicamentoService = {
      listar: jest.fn().mockReturnValue(of(paginado)),
      listarCategorias: jest.fn().mockReturnValue(of(['Analgésicos'])),
    } as unknown as jest.Mocked<MedicamentoService>;
    ventaService = { procesar: jest.fn() } as unknown as jest.Mocked<VentaService>;
    carrito = new CarritoService();

    component = new VentaRapidaComponent(medicamentoService, carrito, ventaService);
  });

  it('ngOnInit carga categorías y resultados iniciales', () => {
    component.ngOnInit();

    expect(component.categorias()).toEqual(['Analgésicos']);
    expect(component.resultados()).toHaveLength(1);
    expect(component.buscando()).toBe(false);
  });

  it('buscar marca buscando en false si la consulta falla', () => {
    medicamentoService.listar.mockReturnValue(throwError(() => new Error('fallo')));

    component.buscar();

    expect(component.buscando()).toBe(false);
  });

  it('seleccionarCategoria actualiza el filtro y vuelve a buscar', () => {
    component.seleccionarCategoria('Analgésicos');

    expect(component.categoriaActiva()).toBe('Analgésicos');
    expect(medicamentoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Analgésicos' }),
    );
  });

  it('agregarAlCarrito delega en el CarritoService', () => {
    component.agregarAlCarrito(crearMedicamento('med-1'));

    expect(component.carrito.itemsCarrito()).toHaveLength(1);
  });

  it('confirmarVenta no hace nada si el carrito está vacío', () => {
    component.confirmarVenta();

    expect(ventaService.procesar).not.toHaveBeenCalled();
  });

  it('confirmarVenta procesa la venta, vacía el carrito y recarga resultados', () => {
    component.agregarAlCarrito(crearMedicamento('med-1'));
    ventaService.procesar.mockReturnValue(of({ id: 'venta-1', fecha: '2026-06-25', total: 5, detalles: [] }));

    component.confirmarVenta();

    expect(component.ventaConfirmada()).toBe('venta-1');
    expect(component.carrito.itemsCarrito()).toHaveLength(0);
    expect(component.procesando()).toBe(false);
  });

  it('confirmarVenta expone el error de stock insuficiente', () => {
    component.agregarAlCarrito(crearMedicamento('med-1'));
    ventaService.procesar.mockReturnValue(
      throwError(() => ({ error: { message: 'Stock insuficiente' } })),
    );

    component.confirmarVenta();

    expect(component.errorMensaje()).toBe('Stock insuficiente');
    expect(component.procesando()).toBe(false);
  });
});
