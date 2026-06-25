import { PartialType } from '@nestjs/mapped-types';
import { CrearMedicamentoDto } from './crear-medicamento.dto';

export class ActualizarMedicamentoDto extends PartialType(CrearMedicamentoDto) {}
