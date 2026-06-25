import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CrearVentaRequest, VentaResponse } from '../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly recurso = '/ventas';

  constructor(private readonly api: ApiService) {}

  procesar(dto: CrearVentaRequest): Observable<VentaResponse> {
    return this.api.post<VentaResponse>(this.recurso, dto);
  }
}
