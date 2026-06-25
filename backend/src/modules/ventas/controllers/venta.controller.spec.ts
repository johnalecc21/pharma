import { VentaController } from './venta.controller';
import { IVentaService } from '../services/venta-service.interface';
import { Role } from '../../../common/enums/role.enum';
import { VentaResponseDto } from '../dtos/venta-response.dto';

describe('VentaController', () => {
  let ventaService: jest.Mocked<IVentaService>;
  let controller: VentaController;

  beforeEach(() => {
    ventaService = { procesarVenta: jest.fn() };
    controller = new VentaController(ventaService);
  });

  it('crear delega en el servicio pasando el id del usuario autenticado', async () => {
    const respuesta: VentaResponseDto = {
      id: 'venta-1',
      fecha: new Date(),
      total: 27.5,
      detalles: [],
    };
    ventaService.procesarVenta.mockResolvedValue(respuesta);

    const dto = { items: [{ medicamentoId: 'med-1', cantidad: 5 }] };
    const usuario = { sub: 'usuario-1', email: 'admin@pharmadash.com', rol: Role.ADMINISTRADOR };

    const resultado = await controller.crear(dto, usuario);

    expect(ventaService.procesarVenta).toHaveBeenCalledWith('usuario-1', dto);
    expect(resultado).toBe(respuesta);
  });
});
