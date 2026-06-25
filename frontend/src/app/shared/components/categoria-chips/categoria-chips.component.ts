import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-categoria-chips',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categoria-chips.component.html',
})
export class CategoriaChipsComponent {
  @Input() categorias: string[] = [];
  @Input() categoriaActiva: string | null = null;
  @Output() seleccionar = new EventEmitter<string | null>();
}
