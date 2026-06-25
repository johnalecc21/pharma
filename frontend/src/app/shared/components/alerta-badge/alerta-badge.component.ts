import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

type TipoAlerta = 'critico' | 'vencimiento';

@Component({
  selector: 'app-alerta-badge',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      [class.bg-rose-100]="tipo === 'critico'"
      [class.text-rose-700]="tipo === 'critico'"
      [class.bg-amber-100]="tipo === 'vencimiento'"
      [class.text-amber-700]="tipo === 'vencimiento'"
    >
      <app-icon [name]="tipo === 'critico' ? 'alert' : 'clock'" [size]="13" />
      {{ texto }}
    </span>
  `,
})
export class AlertaBadgeComponent {
  @Input() tipo: TipoAlerta = 'critico';
  @Input() texto = '';
}
