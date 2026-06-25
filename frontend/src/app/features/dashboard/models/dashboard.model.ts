export interface KpiDashboard {
  ingresosHoy: number;
  stockCriticoCount: number;
  vencimientoProximoCount: number;
  totalProductos: number;
}

export interface TopMedicamentoVendido {
  medicamentoId: string;
  nombre: string;
  totalVendido: number;
}

export interface MedicamentoAlerta {
  id: string;
  nombre: string;
  sku: string;
  stock: number;
  fechaVencimiento: string;
  stockCritico: boolean;
  vencimientoProximo: boolean;
  diasParaVencer: number;
}
