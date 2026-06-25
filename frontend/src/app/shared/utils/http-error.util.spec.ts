import { extraerMensajeError } from './http-error.util';

describe('extraerMensajeError', () => {
  it('extrae el mensaje cuando es un string', () => {
    const error = { error: { message: 'Credenciales inválidas' } };

    expect(extraerMensajeError(error, 'genérico')).toBe('Credenciales inválidas');
  });

  it('une los mensajes cuando son un array de strings (errores de validación)', () => {
    const error = { error: { message: ['El email es inválido', 'La contraseña es muy corta'] } };

    expect(extraerMensajeError(error, 'genérico')).toBe(
      'El email es inválido, La contraseña es muy corta',
    );
  });

  it('retorna el mensaje por defecto si no hay error.message', () => {
    expect(extraerMensajeError({}, 'genérico')).toBe('genérico');
  });

  it('retorna el mensaje por defecto si el error es null o undefined', () => {
    expect(extraerMensajeError(null, 'genérico')).toBe('genérico');
    expect(extraerMensajeError(undefined, 'genérico')).toBe('genérico');
  });

  it('retorna el mensaje por defecto si message no es string ni array de strings', () => {
    const error = { error: { message: { codigo: 500 } } };

    expect(extraerMensajeError(error, 'genérico')).toBe('genérico');
  });
});
