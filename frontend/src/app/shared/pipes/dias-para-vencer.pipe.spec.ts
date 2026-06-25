import { DiasParaVencerPipe } from './dias-para-vencer.pipe';

describe('DiasParaVencerPipe', () => {
  let pipe: DiasParaVencerPipe;

  beforeEach(() => {
    pipe = new DiasParaVencerPipe();
  });

  it('muestra "Vence hoy" cuando faltan 0 días', () => {
    expect(pipe.transform(0)).toBe('Vence hoy');
  });

  it('muestra los días restantes en singular', () => {
    expect(pipe.transform(1)).toBe('Vence en 1 día');
  });

  it('muestra los días restantes en plural', () => {
    expect(pipe.transform(5)).toBe('Vence en 5 días');
  });

  it('muestra que ya venció en singular', () => {
    expect(pipe.transform(-1)).toBe('Vencido hace 1 día');
  });

  it('muestra que ya venció en plural', () => {
    expect(pipe.transform(-3)).toBe('Vencido hace 3 días');
  });
});
