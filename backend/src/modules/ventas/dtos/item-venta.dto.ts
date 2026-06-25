import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class ItemVentaDto {
  @IsUUID()
  medicamentoId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
