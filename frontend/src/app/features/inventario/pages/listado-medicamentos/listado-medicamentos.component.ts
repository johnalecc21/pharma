import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../models/medicamento.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AlertaBadgeComponent } from '../../../../shared/components/alerta-badge/alerta-badge.component';
import { PaginadorComponent } from '../../../../shared/components/paginador/paginador.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CategoriaChipsComponent } from '../../../../shared/components/categoria-chips/categoria-chips.component';
import { FormMedicamentoComponent } from '../form-medicamento/form-medicamento.component';

type ModalEstado = 'nuevo' | string | null;

@Component({
  selector: 'app-listado-medicamentos',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    IconComponent,
    AlertaBadgeComponent,
    PaginadorComponent,
    ModalComponent,
    CategoriaChipsComponent,
    FormMedicamentoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listado-medicamentos.component.html',
})
export class ListadoMedicamentosComponent implements OnInit {
  readonly medicamentos = signal<Medicamento[]>([]);
  readonly cargando = signal(false);
  readonly total = signal(0);
  readonly totalPaginas = signal(1);
  readonly pagina = signal(1);
  readonly limite = 8;

  readonly categorias = signal<string[]>([]);
  readonly categoriaActiva = signal<string | null>(null);
  readonly modalAbierto = signal<ModalEstado>(null);

  filtroNombre = '';

  constructor(private readonly medicamentoService: MedicamentoService) {}

  ngOnInit(): void {
    this.medicamentoService.listarCategorias().subscribe((categorias) => {
      this.categorias.set(categorias);
    });
    this.cargar();
  }

  buscar(): void {
    this.pagina.set(1);
    this.cargar();
  }

  seleccionarCategoria(categoria: string | null): void {
    this.categoriaActiva.set(categoria);
    this.buscar();
  }

  irAPagina(pagina: number): void {
    this.pagina.set(pagina);
    this.cargar();
  }

  abrirNuevo(): void {
    this.modalAbierto.set('nuevo');
  }

  abrirEditar(medicamento: Medicamento): void {
    this.modalAbierto.set(medicamento.id);
  }

  cerrarModal(): void {
    this.modalAbierto.set(null);
  }

  guardadoExitoso(): void {
    this.modalAbierto.set(null);
    this.cargar();
  }

  eliminar(medicamento: Medicamento): void {
    const confirmado = window.confirm(`¿Eliminar "${medicamento.nombre}" del inventario?`);
    if (!confirmado) {
      return;
    }

    this.medicamentoService.eliminar(medicamento.id).subscribe(() => this.cargar());
  }

  get medicamentoIdEnEdicion(): string | null {
    const estado = this.modalAbierto();
    return estado && estado !== 'nuevo' ? estado : null;
  }

  private cargar(): void {
    this.cargando.set(true);

    this.medicamentoService
      .listar({
        nombre: this.filtroNombre || undefined,
        categoria: this.categoriaActiva() ?? undefined,
        pagina: this.pagina(),
        limite: this.limite,
      })
      .subscribe({
        next: (resultado) => {
          this.medicamentos.set(resultado.data);
          this.total.set(resultado.total);
          this.totalPaginas.set(resultado.totalPaginas);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
  }
}
