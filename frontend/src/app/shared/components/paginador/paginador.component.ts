import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between px-2 py-3 text-sm text-slate-500">
      <p>
        Página <span class="font-semibold text-slate-700">{{ pagina }}</span> de
        <span class="font-semibold text-slate-700">{{ totalPaginas || 1 }}</span>
        · {{ total }} resultado{{ total === 1 ? '' : 's' }}
      </p>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="pagina <= 1"
          (click)="cambiarPagina.emit(pagina - 1)"
        >
          ‹
        </button>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="pagina >= totalPaginas"
          (click)="cambiarPagina.emit(pagina + 1)"
        >
          ›
        </button>
      </div>
    </div>
  `,
})
export class PaginadorComponent {
  @Input() pagina = 1;
  @Input() totalPaginas = 1;
  @Input() total = 0;
  @Output() cambiarPagina = new EventEmitter<number>();
}
