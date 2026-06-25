import { CarritoService } from './carrito.service';
import { Medicamento } from '../../inventario/models/medicamento.model';

function crearMedicamento(id: string, stock: number, precio: number): Medicamento {
  return {
    id,
    nombre: `Medicamento ${id}`,
    categoria: 'Analgésicos',
    sku: `SKU-${id}`,
    precioUnitario: precio,
    stock,
    fechaVencimiento: '2026-12-01',
    stockCritico: false,
    vencimientoProximo: false,
    diasParaVencer: 100,
  };
}

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    service = new CarritoService();
  });

  it('inicia vacío', () => {
    expect(service.itemsCarrito()).toEqual([]);
    expect(service.cantidadItems()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('agrega un medicamento nuevo con cantidad 1', () => {
    service.agregar(crearMedicamento('med-1', 10, 5));

    expect(service.itemsCarrito()).toHaveLength(1);
    expect(service.itemsCarrito()[0].cantidad).toBe(1);
    expect(service.total()).toBe(5);
  });

  it('incrementa la cantidad si el medicamento ya está en el carrito', () => {
    const medicamento = crearMedicamento('med-1', 10, 5);

    service.agregar(medicamento);
    service.agregar(medicamento);

    expect(service.itemsCarrito()).toHaveLength(1);
    expect(service.itemsCarrito()[0].cantidad).toBe(2);
    expect(service.cantidadItems()).toBe(2);
    expect(service.total()).toBe(10);
  });

  it('no agrega un medicamento sin stock', () => {
    service.agregar(crearMedicamento('med-1', 0, 5));

    expect(service.itemsCarrito()).toHaveLength(0);
  });

  it('actualizarCantidad respeta el límite de stock disponible', () => {
    service.agregar(crearMedicamento('med-1', 3, 5));

    service.actualizarCantidad('med-1', 10);

    expect(service.itemsCarrito()[0].cantidad).toBe(3);
  });

  it('actualizarCantidad quita el item si la cantidad es menor a 1', () => {
    service.agregar(crearMedicamento('med-1', 10, 5));

    service.actualizarCantidad('med-1', 0);

    expect(service.itemsCarrito()).toHaveLength(0);
  });

  it('quitar elimina el item del carrito', () => {
    service.agregar(crearMedicamento('med-1', 10, 5));

    service.quitar('med-1');

    expect(service.itemsCarrito()).toHaveLength(0);
  });

  it('vaciar deja el carrito en blanco', () => {
    service.agregar(crearMedicamento('med-1', 10, 5));
    service.agregar(crearMedicamento('med-2', 10, 3));

    service.vaciar();

    expect(service.itemsCarrito()).toHaveLength(0);
    expect(service.total()).toBe(0);
  });
});
