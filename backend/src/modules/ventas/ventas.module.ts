import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { VENTA_REPOSITORY } from './repositories/venta-repository.interface';
import { VentaRepository } from './repositories/venta.repository';
import { VentaService } from './services/venta.service';
import { StockValidatorService } from './services/stock-validator.service';
import { VentaController } from './controllers/venta.controller';
import { MedicamentosModule } from '../medicamentos/medicamentos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta]), MedicamentosModule],
  controllers: [VentaController],
  providers: [
    {
      provide: VENTA_REPOSITORY,
      useClass: VentaRepository,
    },
    VentaService,
    StockValidatorService,
  ],
  exports: [VENTA_REPOSITORY],
})
export class VentasModule {}
