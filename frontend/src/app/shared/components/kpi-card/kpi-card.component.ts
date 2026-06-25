import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

type VarianteKpi = 'brand' | 'rose' | 'amber' | 'slate';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        [class.bg-brand-50]="variante === 'brand'"
        [class.text-brand-600]="variante === 'brand'"
        [class.bg-rose-50]="variante === 'rose'"
        [class.text-rose-600]="variante === 'rose'"
        [class.bg-amber-50]="variante === 'amber'"
        [class.text-amber-600]="variante === 'amber'"
        [class.bg-slate-100]="variante === 'slate'"
        [class.text-slate-600]="variante === 'slate'"
      >
        <app-icon [name]="icono" [size]="22" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-slate-500">{{ titulo }}</p>
        <p class="text-2xl font-bold text-slate-800">{{ valor }}</p>
        @if (descripcion) {
          <p class="mt-0.5 text-xs text-slate-400">{{ descripcion }}</p>
        }
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() titulo = '';
  @Input() valor: string | number | null = '';
  @Input() descripcion = '';
  @Input() icono = 'cash';
  @Input() variante: VarianteKpi = 'brand';
}
