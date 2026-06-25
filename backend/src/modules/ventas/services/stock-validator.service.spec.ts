import { NotFoundException } from '@nestjs/common';
import { StockValidatorService } from './stock-validator.service';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { StockInsuficienteException } from '../../../common/exceptions/stock-insuficiente.exception';

function crearMedicamento(id: string, nombre: string, stock: number): Medicamento {
  const medicamento = new Medicamento();
  medicamento.id = id;
  medicamento.nombre = nombre;
  medicamento.stock = stock;
  return medicamento;
}

describe('StockValidatorService', () => {
  let service: StockValidatorService;

  beforeEach(() => {
    service = new StockValidatorService();
  });

  it('no lanza error cuando hay stock suficiente', () => {
    const medicamentos = new Map([['med-1', crearMedicamento('med-1', 'Paracetamol', 20)]]);

    expect(() =>
      service.validarDisponibilidad(medicamentos, [{ medicamentoId: 'med-1', cantidad: 5 }]),
    ).not.toThrow();
  });

  it('lanza StockInsuficienteException (RN-02) cuando la cantidad solicitada excede el stock', () => {
    const medicamentos = new Map([['med-1', crearMedicamento('med-1', 'Paracetamol', 3)]]);

    expect(() =>
      service.validarDisponibilidad(medicamentos, [{ medicamentoId: 'med-1', cantidad: 10 }]),
    ).toThrow(StockInsuficienteException);
  });

  it('lanza NotFoundException cuando el medicamento no existe en el mapa', () => {
    const medicamentos = new Map<string, Medicamento>();

    expect(() =>
      service.validarDisponibilidad(medicamentos, [{ medicamentoId: 'inexistente', cantidad: 1 }]),
    ).toThrow(NotFoundException);
  });
});
