import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IMedicamentoService } from '../services/medicamento-service.interface';
import { MedicamentoService } from '../services/medicamento.service';
import { CrearMedicamentoDto } from '../dtos/crear-medicamento.dto';
import { ActualizarMedicamentoDto } from '../dtos/actualizar-medicamento.dto';
import { FiltroMedicamentoDto } from '../dtos/filtro-medicamento.dto';
import { MedicamentoResponseDto } from '../dtos/medicamento-response.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Controller('medicamentos')
export class MedicamentoController {
  constructor(
    @Inject(MedicamentoService)
    private readonly medicamentoService: IMedicamentoService,
  ) {}

  @Get()
  async listar(
    @Query() filtro: FiltroMedicamentoDto,
  ): Promise<PaginatedResult<MedicamentoResponseDto>> {
    return this.medicamentoService.listar(filtro);
  }

  @Get('categorias')
  async listarCategorias(): Promise<string[]> {
    return this.medicamentoService.listarCategorias();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string): Promise<MedicamentoResponseDto> {
    return this.medicamentoService.obtenerPorId(id);
  }

  @Roles(Role.ADMINISTRADOR, Role.FARMACEUTICO)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearMedicamentoDto): Promise<MedicamentoResponseDto> {
    return this.medicamentoService.crear(dto);
  }

  @Roles(Role.ADMINISTRADOR, Role.FARMACEUTICO)
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarMedicamentoDto,
  ): Promise<MedicamentoResponseDto> {
    return this.medicamentoService.actualizar(id, dto);
  }

  @Roles(Role.ADMINISTRADOR)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.medicamentoService.eliminar(id);
  }
}
