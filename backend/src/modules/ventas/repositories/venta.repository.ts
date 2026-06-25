import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { IVentaRepository, TopMedicamentoVendido } from './venta-repository.interface';
import { ItemVentaDto } from '../dtos/item-venta.dto';
import { StockInsuficienteException } from '../../../common/exceptions/stock-insuficiente.exception';

@Injectable()
export class VentaRepository implements IVentaRepository {
  constructor(private readonly dataSource: DataSource) {}

  async crearTransaccional(usuarioId: string, items: ItemVentaDto[]): Promise<Venta> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const detalles: DetalleVenta[] = [];
      let total = 0;

      for (const item of items) {
        const medicamento = await manager
          .getRepository(Medicamento)
          .createQueryBuilder('medicamento')
          .setLock('pessimistic_write')
          .where('medicamento.id = :id', { id: item.medicamentoId })
          .getOne();

        if (!medicamento) {
          throw new StockInsuficienteException('desconocido', 0, item.cantidad);
        }

        if (medicamento.stock < item.cantidad) {
          throw new StockInsuficienteException(
            medicamento.nombre,
            medicamento.stock,
            item.cantidad,
          );
        }

        medicamento.stock -= item.cantidad;
        await manager.save(Medicamento, medicamento);

        const precioUnitario = Number(medicamento.precioUnitario);
        const subtotal = precioUnitario * item.cantidad;
        total += subtotal;

        const detalle = new DetalleVenta();
        detalle.medicamentoId = medicamento.id;
        detalle.cantidad = item.cantidad;
        detalle.precioUnitarioSnapshot = precioUnitario;
        detalle.subtotal = subtotal;
        detalles.push(detalle);
      }

      const venta = new Venta();
      venta.usuarioId = usuarioId;
      venta.total = total;
      venta.detalles = detalles;

      return manager.save(Venta, venta);
    });
  }

  async obtenerIngresosDelDia(fecha: Date): Promise<number> {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const resultado = await this.dataSource
      .getRepository(Venta)
      .createQueryBuilder('venta')
      .select('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .getRawOne<{ total: string }>();

    return Number(resultado?.total ?? 0);
  }

  async obtenerTop5MasVendidos(): Promise<TopMedicamentoVendido[]> {
    const filas = await this.dataSource
      .getRepository(DetalleVenta)
      .createQueryBuilder('detalle')
      .innerJoin('detalle.medicamento', 'medicamento')
      .select('medicamento.id', 'medicamentoId')
      .addSelect('medicamento.nombre', 'nombre')
      .addSelect('SUM(detalle.cantidad)', 'totalVendido')
      .groupBy('medicamento.id')
      .addGroupBy('medicamento.nombre')
      .orderBy('"totalVendido"', 'DESC')
      .limit(5)
      .getRawMany<{ medicamentoId: string; nombre: string; totalVendido: string }>();

    return filas.map((fila) => ({
      medicamentoId: fila.medicamentoId,
      nombre: fila.nombre,
      totalVendido: Number(fila.totalVendido),
    }));
  }
}
