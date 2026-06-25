import { HttpStatus } from '@nestjs/common';
import { CredencialesInvalidasException } from './credenciales-invalidas.exception';
import { EmailDuplicadoException } from './email-duplicado.exception';
import { SkuDuplicadoException } from './sku-duplicado.exception';
import { StockInsuficienteException } from './stock-insuficiente.exception';

describe('Excepciones de dominio', () => {
  it('CredencialesInvalidasException retorna 401 con mensaje genérico', () => {
    const exception = new CredencialesInvalidasException();

    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    expect(exception.message).toBe('Email o contraseña incorrectos');
  });

  it('EmailDuplicadoException retorna 409 incluyendo el email', () => {
    const exception = new EmailDuplicadoException('admin@pharmadash.com');

    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.message).toContain('admin@pharmadash.com');
  });

  it('SkuDuplicadoException retorna 409 incluyendo el SKU', () => {
    const exception = new SkuDuplicadoException('PARA500');

    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.message).toContain('PARA500');
  });

  it('StockInsuficienteException retorna 422 con disponible y solicitado (RN-02)', () => {
    const exception = new StockInsuficienteException('Paracetamol', 3, 10);

    expect(exception.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(exception.message).toContain('Paracetamol');
    expect(exception.message).toContain('3');
    expect(exception.message).toContain('10');
  });
});
