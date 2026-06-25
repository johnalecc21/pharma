import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';
import {
  ActualizarMedicamentoRequest,
  CrearMedicamentoRequest,
  FiltroMedicamento,
  Medicamento,
} from '../models/medicamento.model';

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private readonly recurso = '/medicamentos';

  constructor(private readonly api: ApiService) {}

  listar(filtro: FiltroMedicamento): Observable<PaginatedResult<Medicamento>> {
    return this.api.get<PaginatedResult<Medicamento>>(this.recurso, { ...filtro });
  }

  obtenerPorId(id: string): Observable<Medicamento> {
    return this.api.get<Medicamento>(`${this.recurso}/${id}`);
  }

  crear(dto: CrearMedicamentoRequest): Observable<Medicamento> {
    return this.api.post<Medicamento>(this.recurso, dto);
  }

  actualizar(id: string, dto: ActualizarMedicamentoRequest): Observable<Medicamento> {
    return this.api.patch<Medicamento>(`${this.recurso}/${id}`, dto);
  }

  eliminar(id: string): Observable<void> {
    return this.api.delete<void>(`${this.recurso}/${id}`);
  }

  listarCategorias(): Observable<string[]> {
    return this.api.get<string[]>(`${this.recurso}/categorias`);
  }
}
