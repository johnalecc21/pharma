import { Medicamento } from '../entities/medicamento.entity';
import { FiltroMedicamentoDto } from '../dtos/filtro-medicamento.dto';

export interface IMedicamentoRepository {
  findAllPaginado(filtro: FiltroMedicamentoDto): Promise<[Medicamento[], number]>;
  findById(id: string): Promise<Medicamento | null>;
  findBySku(sku: string): Promise<Medicamento | null>;
  save(medicamento: Medicamento): Promise<Medicamento>;
  delete(id: string): Promise<void>;
  contarStockCritico(): Promise<number>;
  contarVencimientoProximo(): Promise<number>;
  contarTotal(): Promise<number>;
  findConAlertas(limite: number): Promise<Medicamento[]>;
  findCategoriasDistintas(): Promise<string[]>;
}

export const MEDICAMENTO_REPOSITORY = Symbol('MEDICAMENTO_REPOSITORY');
