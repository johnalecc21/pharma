import { AlertaBadgeComponent } from './alerta-badge.component';

describe('AlertaBadgeComponent', () => {
  it('expone valores por defecto', () => {
    const component = new AlertaBadgeComponent();

    expect(component.tipo).toBe('critico');
    expect(component.texto).toBe('');
  });

  it('permite asignar tipo y texto', () => {
    const component = new AlertaBadgeComponent();

    component.tipo = 'vencimiento';
    component.texto = 'Vence pronto';

    expect(component.tipo).toBe('vencimiento');
    expect(component.texto).toBe('Vence pronto');
  });
});
