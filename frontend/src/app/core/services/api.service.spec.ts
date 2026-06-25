import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let http: jest.Mocked<HttpClient>;
  let service: ApiService;

  beforeEach(() => {
    http = {
      get: jest.fn().mockReturnValue(of(null)),
      post: jest.fn().mockReturnValue(of(null)),
      patch: jest.fn().mockReturnValue(of(null)),
      put: jest.fn().mockReturnValue(of(null)),
      delete: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<HttpClient>;

    service = new ApiService(http);
  });

  it('get antepone la base de la API a la ruta', () => {
    service.get('/medicamentos').subscribe();

    expect(http.get).toHaveBeenCalledWith(
      `${environment.apiUrl}/medicamentos`,
      expect.objectContaining({ params: expect.any(HttpParams) }),
    );
  });

  it('get incluye solo los parámetros definidos y no vacíos', () => {
    service
      .get('/medicamentos', { nombre: 'para', categoria: undefined, pagina: 1, vacio: '' })
      .subscribe();

    const params = (http.get as jest.Mock).mock.calls[0][1].params as HttpParams;

    expect(params.has('nombre')).toBe(true);
    expect(params.get('nombre')).toBe('para');
    expect(params.has('pagina')).toBe(true);
    expect(params.has('categoria')).toBe(false);
    expect(params.has('vacio')).toBe(false);
  });

  it('post envía el body a la ruta con la base de la API', () => {
    const body = { nombre: 'Paracetamol' };

    service.post('/medicamentos', body).subscribe();

    expect(http.post).toHaveBeenCalledWith(`${environment.apiUrl}/medicamentos`, body);
  });

  it('patch envía el body a la ruta con la base de la API', () => {
    service.patch('/medicamentos/1', { stock: 5 }).subscribe();

    expect(http.patch).toHaveBeenCalledWith(`${environment.apiUrl}/medicamentos/1`, { stock: 5 });
  });

  it('put envía el body a la ruta con la base de la API', () => {
    service.put('/medicamentos/1', { stock: 5 }).subscribe();

    expect(http.put).toHaveBeenCalledWith(`${environment.apiUrl}/medicamentos/1`, { stock: 5 });
  });

  it('delete usa la ruta con la base de la API', () => {
    service.delete('/medicamentos/1').subscribe();

    expect(http.delete).toHaveBeenCalledWith(`${environment.apiUrl}/medicamentos/1`);
  });
});
