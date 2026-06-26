import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicamentoListadoService } from '../../state/medicamento-listado.service';
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
  providers: [MedicamentoListadoService],
  templateUrl: './listado-medicamentos.component.html',
})
export class ListadoMedicamentosComponent implements OnInit {
  readonly modalAbierto = signal<ModalEstado>(null);

  constructor(readonly listado: MedicamentoListadoService) {}

  ngOnInit(): void {
    this.listado.inicializar();
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
    this.listado.cargar();
  }

  eliminar(medicamento: Medicamento): void {
    const confirmado = window.confirm(`¿Eliminar "${medicamento.nombre}" del inventario?`);
    if (!confirmado) {
      return;
    }

    this.listado.eliminar(medicamento);
  }

  get medicamentoIdEnEdicion(): string | null {
    const estado = this.modalAbierto();
    return estado && estado !== 'nuevo' ? estado : null;
  }
}
