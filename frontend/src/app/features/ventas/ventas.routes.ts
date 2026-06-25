import { Routes } from '@angular/router';

export const ventasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/venta-rapida/venta-rapida.component').then((m) => m.VentaRapidaComponent),
  },
];
