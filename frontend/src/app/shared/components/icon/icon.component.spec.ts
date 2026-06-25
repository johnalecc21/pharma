import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  it('retorna el path del icono solicitado', () => {
    const component = new IconComponent();
    component.name = 'cart';

    expect(component.path).toContain('M3 3h2l.4 2');
  });

  it('retorna el path de "grid" cuando el nombre no existe', () => {
    const component = new IconComponent();
    component.name = 'inexistente';

    expect(component.path).toBe('M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z');
  });
});
