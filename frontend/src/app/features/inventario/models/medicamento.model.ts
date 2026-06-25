export interface Medicamento {
  id: string;
  nombre: string;
  categoria: string;
  sku: string;
  precioUnitario: number;
  stock: number;
  fechaVencimiento: string;
  stockCritico: boolean;
  vencimientoProximo: boolean;
  diasParaVencer: number;
}

export interface CrearMedicamentoRequest {
  nombre: string;
  categoria: string;
  sku: string;
  precioUnitario: number;
  stock: number;
  fechaVencimiento: string;
}

export type ActualizarMedicamentoRequest = Partial<CrearMedicamentoRequest>;

export interface FiltroMedicamento {
  nombre?: string;
  categoria?: string;
  pagina: number;
  limite: number;
}
