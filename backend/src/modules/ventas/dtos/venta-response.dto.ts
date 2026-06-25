export class DetalleVentaResponseDto {
  medicamentoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class VentaResponseDto {
  id: string;
  fecha: Date;
  total: number;
  detalles: DetalleVentaResponseDto[];
}
