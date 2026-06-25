import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito } from '../models/venta.model';
import { Medicamento } from '../../inventario/models/medicamento.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly items = signal<ItemCarrito[]>([]);

  readonly itemsCarrito = computed(() => this.items());
  readonly cantidadItems = computed(() =>
    this.items().reduce((acumulado, item) => acumulado + item.cantidad, 0),
  );
  readonly total = computed(() =>
    this.items().reduce((acumulado, item) => acumulado + item.precioUnitario * item.cantidad, 0),
  );

  agregar(medicamento: Medicamento): void {
    const existente = this.items().find((item) => item.medicamentoId === medicamento.id);

    if (existente) {
      this.actualizarCantidad(medicamento.id, existente.cantidad + 1);
      return;
    }

    if (medicamento.stock < 1) {
      return;
    }

    this.items.set([
      ...this.items(),
      {
        medicamentoId: medicamento.id,
        nombre: medicamento.nombre,
        sku: medicamento.sku,
        precioUnitario: medicamento.precioUnitario,
        cantidad: 1,
        stockDisponible: medicamento.stock,
      },
    ]);
  }

  actualizarCantidad(medicamentoId: string, cantidad: number): void {
    if (cantidad < 1) {
      this.quitar(medicamentoId);
      return;
    }

    this.items.set(
      this.items().map((item) =>
        item.medicamentoId === medicamentoId
          ? { ...item, cantidad: Math.min(cantidad, item.stockDisponible) }
          : item,
      ),
    );
  }

  quitar(medicamentoId: string): void {
    this.items.set(this.items().filter((item) => item.medicamentoId !== medicamentoId));
  }

  vaciar(): void {
    this.items.set([]);
  }
}
