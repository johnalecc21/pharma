import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { MEDICAMENTO_REPOSITORY } from './repositories/medicamento-repository.interface';
import { MedicamentoRepository } from './repositories/medicamento.repository';
import { MedicamentoService } from './services/medicamento.service';
import { MedicamentoAlertasService } from './services/medicamento-alertas.service';
import { MedicamentoFactory } from './factories/medicamento.factory';
import { MedicamentoController } from './controllers/medicamento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento])],
  controllers: [MedicamentoController],
  providers: [
    {
      provide: MEDICAMENTO_REPOSITORY,
      useClass: MedicamentoRepository,
    },
    MedicamentoService,
    MedicamentoAlertasService,
    MedicamentoFactory,
  ],
  exports: [MEDICAMENTO_REPOSITORY, MedicamentoAlertasService],
})
export class MedicamentosModule {}
