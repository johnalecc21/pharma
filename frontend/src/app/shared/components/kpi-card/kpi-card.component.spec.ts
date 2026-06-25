import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  it('expone valores por defecto', () => {
    const component = new KpiCardComponent();

    expect(component.titulo).toBe('');
    expect(component.valor).toBe('');
    expect(component.descripcion).toBe('');
    expect(component.icono).toBe('cash');
    expect(component.variante).toBe('brand');
  });

  it('permite asignar los inputs', () => {
    const component = new KpiCardComponent();

    component.titulo = 'Stock crítico';
    component.valor = 3;
    component.descripcion = 'Productos con menos de 10 unidades';
    component.icono = 'alert';
    component.variante = 'rose';

    expect(component.titulo).toBe('Stock crítico');
    expect(component.valor).toBe(3);
    expect(component.variante).toBe('rose');
  });
});
