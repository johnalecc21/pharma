import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { IVentaService } from '../services/venta-service.interface';
import { VentaService } from '../services/venta.service';
import { CrearVentaDto } from '../dtos/crear-venta.dto';
import { VentaResponseDto } from '../dtos/venta-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/authenticated-request.interface';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Controller('ventas')
export class VentaController {
  constructor(
    @Inject(VentaService)
    private readonly ventaService: IVentaService,
  ) {}

  @Roles(Role.ADMINISTRADOR, Role.FARMACEUTICO)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Body() dto: CrearVentaDto,
    @CurrentUser() usuario: JwtPayload,
  ): Promise<VentaResponseDto> {
    return this.ventaService.procesarVenta(usuario.sub, dto);
  }
}
