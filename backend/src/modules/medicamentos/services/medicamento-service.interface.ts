import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { CrearMedicamentoDto } from '../dtos/crear-medicamento.dto';
import { ActualizarMedicamentoDto } from '../dtos/actualizar-medicamento.dto';
import { FiltroMedicamentoDto } from '../dtos/filtro-medicamento.dto';
import { MedicamentoResponseDto } from '../dtos/medicamento-response.dto';

export interface IMedicamentoService {
  listar(filtro: FiltroMedicamentoDto): Promise<PaginatedResult<MedicamentoResponseDto>>;
  obtenerPorId(id: string): Promise<MedicamentoResponseDto>;
  crear(dto: CrearMedicamentoDto): Promise<MedicamentoResponseDto>;
  actualizar(id: string, dto: ActualizarMedicamentoDto): Promise<MedicamentoResponseDto>;
  eliminar(id: string): Promise<void>;
  listarCategorias(): Promise<string[]>;
}
