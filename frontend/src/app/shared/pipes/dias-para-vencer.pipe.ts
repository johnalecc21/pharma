import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diasParaVencer',
  standalone: true,
})
export class DiasParaVencerPipe implements PipeTransform {
  transform(dias: number): string {
    if (dias < 0) {
      return `Vencido hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? '' : 's'}`;
    }

    if (dias === 0) {
      return 'Vence hoy';
    }

    return `Vence en ${dias} día${dias === 1 ? '' : 's'}`;
  }
}
