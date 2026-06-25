import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicamentoAlerta } from '../../models/dashboard.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AlertaBadgeComponent } from '../../../../shared/components/alerta-badge/alerta-badge.component';
import { DiasParaVencerPipe } from '../../../../shared/pipes/dias-para-vencer.pipe';

@Component({
  selector: 'app-alertas-inventario',
  standalone: true,
  imports: [RouterLink, IconComponent, AlertaBadgeComponent, DiasParaVencerPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alertas-inventario.component.html',
})
export class AlertasInventarioComponent {
  @Input() alertas: MedicamentoAlerta[] = [];
}
