import { AlertasInventarioComponent } from './alertas-inventario.component';

describe('AlertasInventarioComponent', () => {
  it('inicia con una lista de alertas vacía', () => {
    const component = new AlertasInventarioComponent();

    expect(component.alertas).toEqual([]);
  });

  it('permite asignar alertas', () => {
    const component = new AlertasInventarioComponent();

    component.alertas = [
      {
        id: 'med-1',
        nombre: 'Paracetamol',
        sku: 'PARA500',
        stock: 3,
        fechaVencimiento: '2026-12-01',
        stockCritico: true,
        vencimientoProximo: false,
        diasParaVencer: 100,
      },
    ];

    expect(component.alertas).toHaveLength(1);
  });
});
