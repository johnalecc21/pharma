import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { TopMedicamentoVendido } from '../../models/dashboard.model';

interface BarraChart {
  nombre: string;
  totalVendido: number;
  porcentaje: number;
}

@Component({
  selector: 'app-top5-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top5-chart.component.html',
})
export class Top5ChartComponent {
  private readonly datos = signal<TopMedicamentoVendido[]>([]);

  @Input() set data(valor: TopMedicamentoVendido[]) {
    this.datos.set(valor ?? []);
  }

  readonly barras = computed<BarraChart[]>(() => {
    const items = this.datos();
    const maximo = Math.max(...items.map((item) => item.totalVendido), 1);

    return items.map((item) => ({
      nombre: item.nombre,
      totalVendido: item.totalVendido,
      porcentaje: Math.round((item.totalVendido / maximo) * 100),
    }));
  });
}
