import { of } from 'rxjs';
import { VentaService } from './venta.service';
import { ApiService } from '../../../core/services/api.service';

describe('VentaService', () => {
  it('procesar envía un POST con los items de la venta', () => {
    const api = { post: jest.fn().mockReturnValue(of(null)) } as unknown as jest.Mocked<ApiService>;
    const service = new VentaService(api);

    const dto = { items: [{ medicamentoId: 'med-1', cantidad: 2 }] };
    service.procesar(dto).subscribe();

    expect(api.post).toHaveBeenCalledWith('/ventas', dto);
  });
});
