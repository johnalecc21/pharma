import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMedicamentoRepository,
  MEDICAMENTO_REPOSITORY,
} from '../repositories/medicamento-repository.interface';
import { Medicamento } from '../entities/medicamento.entity';
import { IMedicamentoService } from './medicamento-service.interface';
import { MedicamentoAlertasService } from './medicamento-alertas.service';
import { MedicamentoFactory } from '../factories/medicamento.factory';
import { CrearMedicamentoDto } from '../dtos/crear-medicamento.dto';
import { ActualizarMedicamentoDto } from '../dtos/actualizar-medicamento.dto';
import { FiltroMedicamentoDto } from '../dtos/filtro-medicamento.dto';
import { MedicamentoResponseDto } from '../dtos/medicamento-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { SkuDuplicadoException } from '../../../common/exceptions/sku-duplicado.exception';
import { mapearMedicamentoAResponse } from '../mappers/medicamento.mapper';

@Injectable()
export class MedicamentoService implements IMedicamentoService {
  constructor(
    @Inject(MEDICAMENTO_REPOSITORY)
    private readonly medicamentoRepository: IMedicamentoRepository,
    private readonly alertasService: MedicamentoAlertasService,
    private readonly medicamentoFactory: MedicamentoFactory,
  ) {}

  async listar(filtro: FiltroMedicamentoDto): Promise<PaginatedResult<MedicamentoResponseDto>> {
    const [medicamentos, total] = await this.medicamentoRepository.findAllPaginado(filtro);

    return {
      data: medicamentos.map((medicamento) => this.mapearRespuesta(medicamento)),
      total,
      pagina: filtro.pagina,
      limite: filtro.limite,
      totalPaginas: Math.ceil(total / filtro.limite),
    };
  }

  async obtenerPorId(id: string): Promise<MedicamentoResponseDto> {
    const medicamento = await this.buscarOFallar(id);
    return this.mapearRespuesta(medicamento);
  }

  async crear(dto: CrearMedicamentoDto): Promise<MedicamentoResponseDto> {
    await this.validarSkuDisponible(dto.sku);

    const medicamento = this.medicamentoFactory.crearDesdeDto(dto);
    const guardado = await this.medicamentoRepository.save(medicamento);
    return this.mapearRespuesta(guardado);
  }

  async actualizar(id: string, dto: ActualizarMedicamentoDto): Promise<MedicamentoResponseDto> {
    const medicamento = await this.buscarOFallar(id);

    if (dto.sku && dto.sku !== medicamento.sku) {
      await this.validarSkuDisponible(dto.sku);
    }

    const actualizado = this.medicamentoFactory.aplicarActualizacion(medicamento, dto);
    const guardado = await this.medicamentoRepository.save(actualizado);
    return this.mapearRespuesta(guardado);
  }

  async eliminar(id: string): Promise<void> {
    await this.buscarOFallar(id);
    await this.medicamentoRepository.delete(id);
  }

  async listarCategorias(): Promise<string[]> {
    return this.medicamentoRepository.findCategoriasDistintas();
  }

  private async validarSkuDisponible(sku: string): Promise<void> {
    const existente = await this.medicamentoRepository.findBySku(sku);
    if (existente) {
      throw new SkuDuplicadoException(sku);
    }
  }

  private async buscarOFallar(id: string): Promise<Medicamento> {
    const medicamento = await this.medicamentoRepository.findById(id);
    if (!medicamento) {
      throw new NotFoundException(`Medicamento con id "${id}" no encontrado`);
    }
    return medicamento;
  }

  private mapearRespuesta(medicamento: Medicamento): MedicamentoResponseDto {
    return mapearMedicamentoAResponse(medicamento, this.alertasService);
  }
}
