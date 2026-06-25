import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicamentoService } from '../../../inventario/services/medicamento.service';
import { Medicamento } from '../../../inventario/models/medicamento.model';
import { CarritoService } from '../../state/carrito.service';
import { VentaService } from '../../services/venta.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CategoriaChipsComponent } from '../../../../shared/components/categoria-chips/categoria-chips.component';
import { extraerMensajeError } from '../../../../shared/utils/http-error.util';

const LIMITE_RESULTADOS = 12;

@Component({
  selector: 'app-venta-rapida',
  standalone: true,
  imports: [FormsModule, DecimalPipe, IconComponent, CategoriaChipsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './venta-rapida.component.html',
})
export class VentaRapidaComponent implements OnInit {
  readonly categorias = signal<string[]>([]);
  readonly categoriaActiva = signal<string | null>(null);
  readonly resultados = signal<Medicamento[]>([]);
  readonly buscando = signal(false);
  readonly procesando = signal(false);
  readonly errorMensaje = signal<string | null>(null);
  readonly ventaConfirmada = signal<string | null>(null);

  termino = '';

  constructor(
    private readonly medicamentoService: MedicamentoService,
    readonly carrito: CarritoService,
    private readonly ventaService: VentaService,
  ) {}

  ngOnInit(): void {
    this.medicamentoService.listarCategorias().subscribe((categorias) => {
      this.categorias.set(categorias);
    });
    this.buscar();
  }

  buscar(): void {
    this.buscando.set(true);

    this.medicamentoService
      .listar({
        nombre: this.termino.trim() || undefined,
        categoria: this.categoriaActiva() ?? undefined,
        pagina: 1,
        limite: LIMITE_RESULTADOS,
      })
      .subscribe({
        next: (resultado) => {
          this.resultados.set(resultado.data);
          this.buscando.set(false);
        },
        error: () => this.buscando.set(false),
      });
  }

  seleccionarCategoria(categoria: string | null): void {
    this.categoriaActiva.set(categoria);
    this.buscar();
  }

  agregarAlCarrito(medicamento: Medicamento): void {
    this.carrito.agregar(medicamento);
  }

  confirmarVenta(): void {
    const items = this.carrito.itemsCarrito();
    if (items.length === 0) {
      return;
    }

    this.procesando.set(true);
    this.errorMensaje.set(null);
    this.ventaConfirmada.set(null);

    this.ventaService
      .procesar({
        items: items.map((item) => ({
          medicamentoId: item.medicamentoId,
          cantidad: item.cantidad,
        })),
      })
      .subscribe({
        next: (venta) => {
          this.procesando.set(false);
          this.ventaConfirmada.set(venta.id);
          this.carrito.vaciar();
          this.buscar();
        },
        error: (error: unknown) => {
          this.procesando.set(false);
          this.errorMensaje.set(extraerMensajeError(error, 'No se pudo procesar la venta'));
        },
      });
  }
}
