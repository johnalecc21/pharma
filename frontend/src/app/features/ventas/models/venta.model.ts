export interface ItemCarrito {
  medicamentoId: string;
  nombre: string;
  sku: string;
  precioUnitario: number;
  cantidad: number;
  stockDisponible: number;
}

export interface ItemVentaRequest {
  medicamentoId: string;
  cantidad: number;
}

export interface CrearVentaRequest {
  items: ItemVentaRequest[];
}

export interface DetalleVentaResponse {
  medicamentoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaResponse {
  id: string;
  fecha: string;
  total: number;
  detalles: DetalleVentaResponse[];
}
