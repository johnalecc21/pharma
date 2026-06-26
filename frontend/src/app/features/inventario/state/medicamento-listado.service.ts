import { Injectable, signal } from '@angular/core';
import { MedicamentoService } from '../services/medicamento.service';
import { Medicamento } from '../models/medicamento.model';

const LIMITE_POR_PAGINA = 8;

@Injectable()
export class MedicamentoListadoService {
  readonly medicamentos = signal<Medicamento[]>([]);
  readonly cargando = signal(false);
  readonly total = signal(0);
  readonly totalPaginas = signal(1);
  readonly pagina = signal(1);
  readonly categorias = signal<string[]>([]);
  readonly categoriaActiva = signal<string | null>(null);

  filtroNombre = '';

  constructor(private readonly medicamentoService: MedicamentoService) {}

  inicializar(): void {
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

  eliminar(medicamento: Medicamento): void {
    this.medicamentoService.eliminar(medicamento.id).subscribe(() => this.cargar());
  }

  cargar(): void {
    this.cargando.set(true);

    this.medicamentoService
      .listar({
        nombre: this.filtroNombre || undefined,
        categoria: this.categoriaActiva() ?? undefined,
        pagina: this.pagina(),
        limite: LIMITE_POR_PAGINA,
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
