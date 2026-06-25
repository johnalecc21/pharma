import { PaginadorComponent } from './paginador.component';

describe('PaginadorComponent', () => {
  it('expone valores por defecto', () => {
    const component = new PaginadorComponent();

    expect(component.pagina).toBe(1);
    expect(component.totalPaginas).toBe(1);
    expect(component.total).toBe(0);
  });

  it('emite cambiarPagina con la página solicitada', () => {
    const component = new PaginadorComponent();
    const emitSpy = jest.spyOn(component.cambiarPagina, 'emit');

    component.cambiarPagina.emit(2);

    expect(emitSpy).toHaveBeenCalledWith(2);
  });
});
