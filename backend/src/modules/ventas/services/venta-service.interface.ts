import { CrearVentaDto } from '../dtos/crear-venta.dto';
import { VentaResponseDto } from '../dtos/venta-response.dto';

export interface IVentaService {
  procesarVenta(usuarioId: string, dto: CrearVentaDto): Promise<VentaResponseDto>;
}
