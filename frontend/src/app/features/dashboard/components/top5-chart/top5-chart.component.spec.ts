import { Top5ChartComponent } from './top5-chart.component';

describe('Top5ChartComponent', () => {
  it('retorna un arreglo vacío cuando no hay datos', () => {
    const component = new Top5ChartComponent();

    expect(component.barras()).toEqual([]);
  });

  it('calcula el porcentaje de cada barra en relación al máximo', () => {
    const component = new Top5ChartComponent();

    component.data = [
      { medicamentoId: 'med-1', nombre: 'Paracetamol', totalVendido: 10 },
      { medicamentoId: 'med-2', nombre: 'Ibuprofeno', totalVendido: 5 },
    ];

    expect(component.barras()).toEqual([
      { nombre: 'Paracetamol', totalVendido: 10, porcentaje: 100 },
      { nombre: 'Ibuprofeno', totalVendido: 5, porcentaje: 50 },
    ]);
  });

  it('usa 1 como máximo mínimo para evitar división por cero', () => {
    const component = new Top5ChartComponent();

    component.data = [{ medicamentoId: 'med-1', nombre: 'Paracetamol', totalVendido: 0 }];

    expect(component.barras()).toEqual([{ nombre: 'Paracetamol', totalVendido: 0, porcentaje: 0 }]);
  });
});
