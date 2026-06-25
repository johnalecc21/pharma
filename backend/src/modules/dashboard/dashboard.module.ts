import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { MedicamentosModule } from '../medicamentos/medicamentos.module';
import { VentasModule } from '../ventas/ventas.module';

@Module({
  imports: [MedicamentosModule, VentasModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
