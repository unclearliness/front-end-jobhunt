import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.getAccount().pipe(
      map((account) => {
        if (!account || !account.role) {
          return router.createUrlTree(['/login']);
        }
        const userRole = account.role.name.toLowerCase();
        const hasAccess = allowedRoles.some((role) => userRole.includes(role.toLowerCase()));
        if (hasAccess) {
          return true;
        }
        return router.createUrlTree(['/unauthorized']);
      }),
      catchError(() => {
        return of(router.createUrlTree(['/login']));
      })
    );
  };
};
