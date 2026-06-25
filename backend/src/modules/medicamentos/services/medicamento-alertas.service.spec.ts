import { MedicamentoAlertasService } from './medicamento-alertas.service';
import { Medicamento } from '../entities/medicamento.entity';

function crearMedicamento(stock: number, diasHastaVencer: number): Medicamento {
  const medicamento = new Medicamento();
  medicamento.stock = stock;

  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + diasHastaVencer);
  medicamento.fechaVencimiento = fecha.toISOString().substring(0, 10);

  return medicamento;
}

describe('MedicamentoAlertasService', () => {
  let service: MedicamentoAlertasService;

  beforeEach(() => {
    service = new MedicamentoAlertasService();
  });

  describe('esStockCritico (RN-03)', () => {
    it('retorna true cuando el stock es menor a 10', () => {
      const medicamento = crearMedicamento(9, 100);
      expect(service.esStockCritico(medicamento)).toBe(true);
    });

    it('retorna false cuando el stock es igual a 10', () => {
      const medicamento = crearMedicamento(10, 100);
      expect(service.esStockCritico(medicamento)).toBe(false);
    });

    it('retorna false cuando el stock es mayor a 10', () => {
      const medicamento = crearMedicamento(50, 100);
      expect(service.esStockCritico(medicamento)).toBe(false);
    });
  });

  describe('esVencimientoProximo (RN-04)', () => {
    it('retorna true cuando faltan exactamente 30 días', () => {
      const medicamento = crearMedicamento(100, 30);
      expect(service.esVencimientoProximo(medicamento)).toBe(true);
    });

    it('retorna true cuando ya venció (días negativos)', () => {
      const medicamento = crearMedicamento(100, -5);
      expect(service.esVencimientoProximo(medicamento)).toBe(true);
    });

    it('retorna false cuando faltan más de 30 días', () => {
      const medicamento = crearMedicamento(100, 31);
      expect(service.esVencimientoProximo(medicamento)).toBe(false);
    });
  });

  describe('calcularDiasParaVencer', () => {
    it('calcula correctamente los días restantes', () => {
      const medicamento = crearMedicamento(100, 15);
      expect(service.calcularDiasParaVencer(medicamento)).toBe(15);
    });
  });
});
