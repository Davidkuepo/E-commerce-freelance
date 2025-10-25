import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../store/auth/auth.store';
import { map, take } from 'rxjs';

/**
 * authGuard - allows access only if an access token is present.
 * Checks NgRx store and falls back to localStorage.
 */
export const authGuard: CanActivateFn = (_route, state): ReturnType<CanActivateFn> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    take(1),
    map((token) => {
      // Fallback to localStorage if store not hydrated yet
      const localToken =
        token ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null);

      if (localToken) {
        return true;
      }

      // Persist intended URL to redirect after successful login
      try {
        if (typeof localStorage !== 'undefined' && state?.url) {
          localStorage.setItem('returnUrl', state.url);
        }
      } catch {
        // ignore storage errors
      }

      return router.createUrlTree(['/login']) as UrlTree;
    }),
  );
};
