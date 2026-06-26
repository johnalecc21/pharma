import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medicamentos')
@Check('"precio_unitario" > 0')
@Check('"stock" >= 0')
export class Medicamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  categoria: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ type: 'int' })
  stock: number;

  @Index()
  @Column({ type: 'date', name: 'fecha_vencimiento' })
  fechaVencimiento: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
