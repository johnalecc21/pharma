import { CategoriaChipsComponent } from './categoria-chips.component';

describe('CategoriaChipsComponent', () => {
  let component: CategoriaChipsComponent;

  beforeEach(() => {
    component = new CategoriaChipsComponent();
  });

  it('expone valores por defecto', () => {
    expect(component.categorias).toEqual([]);
    expect(component.categoriaActiva).toBeNull();
  });

  it('emite seleccionar con null al elegir "Todas"', () => {
    const emitSpy = jest.spyOn(component.seleccionar, 'emit');

    component.seleccionar.emit(null);

    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('emite seleccionar con la categoría elegida', () => {
    const emitSpy = jest.spyOn(component.seleccionar, 'emit');

    component.seleccionar.emit('Analgésicos');

    expect(emitSpy).toHaveBeenCalledWith('Analgésicos');
  });
});
