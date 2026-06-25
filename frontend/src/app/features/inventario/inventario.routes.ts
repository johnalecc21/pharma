import { Routes } from '@angular/router';

export const inventarioRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/listado-medicamentos/listado-medicamentos.component').then(
        (m) => m.ListadoMedicamentosComponent,
      ),
  },
];
