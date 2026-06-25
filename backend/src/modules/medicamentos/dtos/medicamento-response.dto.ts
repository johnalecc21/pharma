export class MedicamentoResponseDto {
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
