import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { Venta } from './venta.entity';

@Entity('detalle_venta')
@Check('"cantidad" > 0')
@Check('"precio_unitario_snapshot" >= 0')
@Check('"subtotal" >= 0')
export class DetalleVenta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Index()
  @Column({ type: 'uuid', name: 'venta_id' })
  ventaId: string;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'medicamento_id' })
  medicamento: Medicamento;

  @Index()
  @Column({ type: 'uuid', name: 'medicamento_id' })
  medicamentoId: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario_snapshot' })
  precioUnitarioSnapshot: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
