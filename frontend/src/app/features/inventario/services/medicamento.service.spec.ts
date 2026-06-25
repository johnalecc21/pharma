import { of } from 'rxjs';
import { MedicamentoService } from './medicamento.service';
import { ApiService } from '../../../core/services/api.service';

describe('MedicamentoService', () => {
  let api: jest.Mocked<ApiService>;
  let service: MedicamentoService;

  beforeEach(() => {
    api = {
      get: jest.fn().mockReturnValue(of(null)),
      post: jest.fn().mockReturnValue(of(null)),
      patch: jest.fn().mockReturnValue(of(null)),
      put: jest.fn().mockReturnValue(of(null)),
      delete: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<ApiService>;

    service = new MedicamentoService(api);
  });

  it('listar pasa el filtro como query params', () => {
    const filtro = { nombre: 'para', pagina: 1, limite: 10 };

    service.listar(filtro).subscribe();

    expect(api.get).toHaveBeenCalledWith('/medicamentos', filtro);
  });

  it('obtenerPorId consulta el recurso con el id', () => {
    service.obtenerPorId('med-1').subscribe();

    expect(api.get).toHaveBeenCalledWith('/medicamentos/med-1');
  });

  it('crear envía un POST con el dto', () => {
    const dto = { nombre: 'Paracetamol', categoria: 'Analgésicos', sku: 'PARA500', precioUnitario: 5, stock: 20, fechaVencimiento: '2026-12-01' };

    service.crear(dto).subscribe();

    expect(api.post).toHaveBeenCalledWith('/medicamentos', dto);
  });

  it('actualizar envía un PATCH al recurso con id', () => {
    service.actualizar('med-1', { stock: 5 }).subscribe();

    expect(api.patch).toHaveBeenCalledWith('/medicamentos/med-1', { stock: 5 });
  });

  it('eliminar envía un DELETE al recurso con id', () => {
    service.eliminar('med-1').subscribe();

    expect(api.delete).toHaveBeenCalledWith('/medicamentos/med-1');
  });

  it('listarCategorias consulta el endpoint de categorías', () => {
    service.listarCategorias().subscribe();

    expect(api.get).toHaveBeenCalledWith('/medicamentos/categorias');
  });
});
