import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../store/auth/auth.store';
import { map, take } from 'rxjs';

/**
 * guestGuard - allows access only if NO access token is present.
 * If a token exists (user authenticated), redirect to home.
 */
export const guestGuard: CanActivateFn = (): ReturnType<CanActivateFn> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    take(1),
    map((token) => {
      const localToken =
        token ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null);
      return localToken ? (router.createUrlTree(['/']) as UrlTree) : true;
    }),
  );
};
