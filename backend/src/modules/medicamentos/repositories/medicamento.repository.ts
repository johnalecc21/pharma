import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Medicamento } from '../entities/medicamento.entity';
import { IMedicamentoRepository } from './medicamento-repository.interface';
import { FiltroMedicamentoDto } from '../dtos/filtro-medicamento.dto';
import { UMBRAL_STOCK_CRITICO, UMBRAL_VENCIMIENTO_DIAS } from '../constants/alertas.constants';

const CONDICION_VENCIMIENTO_PROXIMO =
  'medicamento.fecha_vencimiento <= (CURRENT_DATE + make_interval(days => :dias))';

@Injectable()
export class MedicamentoRepository implements IMedicamentoRepository {
  constructor(
    @InjectRepository(Medicamento)
    private readonly repository: Repository<Medicamento>,
  ) {}

  async findAllPaginado(filtro: FiltroMedicamentoDto): Promise<[Medicamento[], number]> {
    return this.repository.findAndCount({
      where: {
        activo: true,
        ...(filtro.nombre ? { nombre: ILike(`%${filtro.nombre}%`) } : {}),
        ...(filtro.categoria ? { categoria: ILike(`%${filtro.categoria}%`) } : {}),
      },
      skip: (filtro.pagina - 1) * filtro.limite,
      take: filtro.limite,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Medicamento | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findBySku(sku: string): Promise<Medicamento | null> {
    return this.repository.findOne({ where: { sku, activo: true } });
  }

  async save(medicamento: Medicamento): Promise<Medicamento> {
    return this.repository.save(medicamento);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { activo: false });
  }

  async contarStockCritico(): Promise<number> {
    return this.queryActivos()
      .andWhere('medicamento.stock < :umbral', { umbral: UMBRAL_STOCK_CRITICO })
      .getCount();
  }

  async contarVencimientoProximo(): Promise<number> {
    return this.queryActivos()
      .andWhere(CONDICION_VENCIMIENTO_PROXIMO, { dias: UMBRAL_VENCIMIENTO_DIAS })
      .getCount();
  }

  async contarTotal(): Promise<number> {
    return this.repository.count({ where: { activo: true } });
  }

  async findConAlertas(limite: number): Promise<Medicamento[]> {
    return this.queryActivos()
      .andWhere(
        new Brackets((qb) => {
          qb.where('medicamento.stock < :umbral', { umbral: UMBRAL_STOCK_CRITICO }).orWhere(
            CONDICION_VENCIMIENTO_PROXIMO,
            { dias: UMBRAL_VENCIMIENTO_DIAS },
          );
        }),
      )
      .orderBy('medicamento.fecha_vencimiento', 'ASC')
      .take(limite)
      .getMany();
  }

  async findCategoriasDistintas(): Promise<string[]> {
    const filas = await this.queryActivos()
      .select('DISTINCT medicamento.categoria', 'categoria')
      .orderBy('medicamento.categoria', 'ASC')
      .getRawMany<{ categoria: string }>();

    return filas.map((fila) => fila.categoria);
  }

  private queryActivos(): SelectQueryBuilder<Medicamento> {
    return this.repository.createQueryBuilder('medicamento').where('medicamento.activo = true');
  }
}
