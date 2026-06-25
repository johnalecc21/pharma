import { Injectable } from '@nestjs/common';
import { Medicamento } from '../entities/medicamento.entity';
import { UMBRAL_STOCK_CRITICO, UMBRAL_VENCIMIENTO_DIAS } from '../constants/alertas.constants';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

@Injectable()
export class MedicamentoAlertasService {
  esStockCritico(medicamento: Medicamento): boolean {
    return medicamento.stock < UMBRAL_STOCK_CRITICO;
  }

  calcularDiasParaVencer(medicamento: Medicamento): number {
    const hoy = new Date();
    const vencimiento = new Date(medicamento.fechaVencimiento);
    const diferenciaMs = vencimiento.getTime() - hoy.setHours(0, 0, 0, 0);
    return Math.ceil(diferenciaMs / MS_POR_DIA);
  }

  esVencimientoProximo(medicamento: Medicamento): boolean {
    return this.calcularDiasParaVencer(medicamento) <= UMBRAL_VENCIMIENTO_DIAS;
  }
}
