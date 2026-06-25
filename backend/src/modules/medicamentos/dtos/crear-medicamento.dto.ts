import { IsDateString, IsInt, IsNumber, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CrearMedicamentoDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  categoria: string;

  @IsString()
  @MinLength(2)
  sku: string;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsDateString()
  fechaVencimiento: string;
}
