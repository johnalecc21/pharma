import { Medicamento } from '../entities/medicamento.entity';
import { MedicamentoAlertasService } from '../services/medicamento-alertas.service';
import { MedicamentoResponseDto } from '../dtos/medicamento-response.dto';

export function mapearMedicamentoAResponse(
  medicamento: Medicamento,
  alertasService: MedicamentoAlertasService,
): MedicamentoResponseDto {
  return {
    id: medicamento.id,
    nombre: medicamento.nombre,
    categoria: medicamento.categoria,
    sku: medicamento.sku,
    precioUnitario: Number(medicamento.precioUnitario),
    stock: medicamento.stock,
    fechaVencimiento: medicamento.fechaVencimiento,
    stockCritico: alertasService.esStockCritico(medicamento),
    vencimientoProximo: alertasService.esVencimientoProximo(medicamento),
    diasParaVencer: alertasService.calcularDiasParaVencer(medicamento),
  };
}
