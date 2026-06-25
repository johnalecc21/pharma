import { mapearMedicamentoAResponse } from './medicamento.mapper';
import { MedicamentoAlertasService } from '../services/medicamento-alertas.service';
import { Medicamento } from '../entities/medicamento.entity';

describe('mapearMedicamentoAResponse', () => {
  const alertasService = new MedicamentoAlertasService();

  it('mapea todos los campos de la entidad y calcula las alertas', () => {
    const medicamento = new Medicamento();
    medicamento.id = 'med-1';
    medicamento.nombre = 'Paracetamol';
    medicamento.categoria = 'Analgésicos';
    medicamento.sku = 'PARA500';
    medicamento.precioUnitario = '5.50' as unknown as number;
    medicamento.stock = 3;
    medicamento.fechaVencimiento = '2026-12-01';

    const dto = mapearMedicamentoAResponse(medicamento, alertasService);

    expect(dto).toEqual({
      id: 'med-1',
      nombre: 'Paracetamol',
      categoria: 'Analgésicos',
      sku: 'PARA500',
      precioUnitario: 5.5,
      stock: 3,
      fechaVencimiento: '2026-12-01',
      stockCritico: true,
      vencimientoProximo: alertasService.esVencimientoProximo(medicamento),
      diasParaVencer: alertasService.calcularDiasParaVencer(medicamento),
    });
  });
});
