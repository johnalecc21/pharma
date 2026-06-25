import { MedicamentoFactory } from './medicamento.factory';
import { Medicamento } from '../entities/medicamento.entity';

describe('MedicamentoFactory', () => {
  let factory: MedicamentoFactory;

  beforeEach(() => {
    factory = new MedicamentoFactory();
  });

  describe('crearDesdeDto', () => {
    it('construye una entidad Medicamento con todos los campos del DTO', () => {
      const dto = {
        nombre: 'Paracetamol',
        categoria: 'Analgésicos',
        sku: 'PARA500',
        precioUnitario: 5.5,
        stock: 20,
        fechaVencimiento: '2026-12-01',
      };

      const medicamento = factory.crearDesdeDto(dto);

      expect(medicamento).toBeInstanceOf(Medicamento);
      expect(medicamento.nombre).toBe('Paracetamol');
      expect(medicamento.categoria).toBe('Analgésicos');
      expect(medicamento.sku).toBe('PARA500');
      expect(medicamento.precioUnitario).toBe(5.5);
      expect(medicamento.stock).toBe(20);
      expect(medicamento.fechaVencimiento).toBe('2026-12-01');
    });
  });

  describe('aplicarActualizacion', () => {
    it('sobrescribe solo los campos presentes en el DTO', () => {
      const medicamento = factory.crearDesdeDto({
        nombre: 'Paracetamol',
        categoria: 'Analgésicos',
        sku: 'PARA500',
        precioUnitario: 5.5,
        stock: 20,
        fechaVencimiento: '2026-12-01',
      });

      const actualizado = factory.aplicarActualizacion(medicamento, { stock: 30 });

      expect(actualizado.stock).toBe(30);
      expect(actualizado.nombre).toBe('Paracetamol');
      expect(actualizado.sku).toBe('PARA500');
    });

    it('sobrescribe todos los campos cuando el DTO los incluye todos', () => {
      const medicamento = factory.crearDesdeDto({
        nombre: 'Paracetamol',
        categoria: 'Analgésicos',
        sku: 'PARA500',
        precioUnitario: 5.5,
        stock: 20,
        fechaVencimiento: '2026-12-01',
      });

      const actualizado = factory.aplicarActualizacion(medicamento, {
        nombre: 'Ibuprofeno',
        categoria: 'Antiinflamatorios',
        sku: 'IBU400',
        precioUnitario: 3.2,
        stock: 7,
        fechaVencimiento: '2026-07-10',
      });

      expect(actualizado).toEqual({
        nombre: 'Ibuprofeno',
        categoria: 'Antiinflamatorios',
        sku: 'IBU400',
        precioUnitario: 3.2,
        stock: 7,
        fechaVencimiento: '2026-07-10',
      });
    });

    it('no modifica ningún campo si el DTO está vacío', () => {
      const medicamento = factory.crearDesdeDto({
        nombre: 'Paracetamol',
        categoria: 'Analgésicos',
        sku: 'PARA500',
        precioUnitario: 5.5,
        stock: 20,
        fechaVencimiento: '2026-12-01',
      });

      const actualizado = factory.aplicarActualizacion(medicamento, {});

      expect(actualizado).toEqual(medicamento);
    });
  });
});
