import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

type VarianteKpi = 'brand' | 'rose' | 'amber' | 'slate';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative overflow-hidden group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.08)]">
      <div
        class="absolute -top-12 -right-12 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        [class.bg-[#E0111C]]="variante === 'brand'"
        [class.bg-rose-500]="variante === 'rose'"
        [class.bg-amber-500]="variante === 'amber'"
        [class.bg-slate-500]="variante === 'slate'"
      ></div>

      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        [class]="iconClasses"
      >
        <app-icon [name]="icono" [size]="22" />
      </div>

      <div class="min-w-0 flex-1 z-10">
        <p class="text-xs font-semibold tracking-wider text-slate-400 uppercase">{{ titulo }}</p>
        <p class="text-2xl font-extrabold text-slate-800 mt-1 tracking-tight">{{ valor }}</p>
        @if (descripcion) {
          <p class="mt-1 text-xs text-slate-400 font-medium leading-relaxed">{{ descripcion }}</p>
        }
      </div>

      <div
        class="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
        [class]="accentLineClasses"
      ></div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() titulo = '';
  @Input() valor: string | number | null = '';
  @Input() descripcion = '';
  @Input() icono = 'cash';
  @Input() variante: VarianteKpi = 'brand';

  get iconClasses(): string {
    switch (this.variante) {
      case 'brand':
        return 'bg-[#E0111C]/10 text-[#E0111C] group-hover:bg-[#E0111C] group-hover:text-white';
      case 'rose':
        return 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white';
      case 'amber':
        return 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white';
      case 'slate':
        return 'bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-white';
      default:
        return '';
    }
  }

  get accentLineClasses(): string {
    switch (this.variante) {
      case 'brand':
        return 'bg-gradient-to-r from-[#E0111C] to-[#ff4d5a]';
      case 'rose':
        return 'bg-gradient-to-r from-rose-500 to-rose-300';
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 to-amber-300';
      case 'slate':
        return 'bg-gradient-to-r from-slate-500 to-slate-300';
      default:
        return '';
    }
  }
}

