import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard = (rolesPermitidos: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const rolActual = authService.rolActual();
    if (rolActual && rolesPermitidos.includes(rolActual)) {
      return true;
    }

    return router.createUrlTree(['/login']);
  };
};
