import { Reflector } from '@nestjs/core';
import { Public, IS_PUBLIC_KEY } from './public.decorator';

describe('Public decorator', () => {
  it('marca el handler como público en la metadata', () => {
    class Controlador {
      @Public()
      metodo(): void {}
    }

    const reflector = new Reflector();
    const esPublico = reflector.get<boolean>(IS_PUBLIC_KEY, Controlador.prototype.metodo);

    expect(esPublico).toBe(true);
  });
});
