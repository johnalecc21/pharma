import { Venta } from '../entities/venta.entity';
import { ItemVentaDto } from '../dtos/item-venta.dto';

export interface TopMedicamentoVendido {
  medicamentoId: string;
  nombre: string;
  totalVendido: number;
}

export interface IVentaRepository {
  crearTransaccional(usuarioId: string, items: ItemVentaDto[]): Promise<Venta>;
  obtenerIngresosDelDia(fecha: Date): Promise<number>;
  obtenerTop5MasVendidos(): Promise<TopMedicamentoVendido[]>;
}

export const VENTA_REPOSITORY = Symbol('VENTA_REPOSITORY');
