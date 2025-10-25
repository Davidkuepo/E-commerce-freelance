import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.store';
import { PanierActions } from '../panier/panier.store';
import { AuthService } from '../../api/api/auth.service';
import { LoginRequest, RegisterRequest } from '../../api';
import { catchError, exhaustMap, map, of, switchMap, tap, forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../api/api/cart.service';

@Injectable({ providedIn: 'root' })
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly cartService = inject(CartService);

  private static toErrorMessage(err: unknown): string {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    const anyErr = err as any;
    // Try HTTP error structure from Angular HttpClient
    if (anyErr?.error?.message) return anyErr.error.message as string;
    if (anyErr?.message) return anyErr.message as string;
    return 'Request failed';
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }: { credentials: LoginRequest }) => {
        // The backend expects { login, password } and returns HAL+JSON with data.token and user fields.
        const payload: any = {
          login:
            (credentials as any)?.email ??
            (credentials as any)?.login ??
            (credentials as any)?.username ??
            '',
          password: (credentials as any)?.password ?? '',
        };

        return this.authService.authLoginPost(payload as any).pipe(
          map((raw: any) => {
            // Normalize server response to internal LoginResponse shape
            const d = raw?.data ?? raw;
            const token = d?.token ?? d?.accessToken ?? '';
            const userNorm: any = {
              id: d?.userCode ?? d?.user?.id ?? 'unknown',
              email: d?.userEmail ?? d?.user?.email ?? '',
              name:
                [d?.userFirstName, d?.userLastName].filter(Boolean).join(' ') ||
                d?.username ||
                d?.user?.name ||
                '',
              roles: (d?.roles ?? d?.user?.roles ?? [])
                .map((r: any) => r?.roleName ?? r?.roleCode ?? r)
                .filter(Boolean),
              imageUrl: d?.imageUrl,
            };

            // Match auth.store.LoginResponse signature
            const response: any = {
              accessToken: token,
              user: userNorm,
            };

            try {
              localStorage.setItem('accessToken', token || '');
              localStorage.setItem('user', JSON.stringify(userNorm ?? null));
            } catch {
              // ignore storage errors
            }

            return AuthActions.loginSuccess({ response });
          }),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: AuthEffects.toErrorMessage(err) })),
          ),
        );
      }),
    ),
  );

  loginNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          let url = '/';
          try {
            const ru =
              typeof localStorage !== 'undefined' ? localStorage.getItem('returnUrl') : null;
            if (ru) {
              url = ru;
              localStorage.removeItem('returnUrl');
            }
          } catch {
            // ignore storage errors
          }
          this.router.navigateByUrl(url);
        }),
      ),
    { dispatch: false },
  );

  // Show success toast and migrate guest cart items to server cart on login
  loginPostSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        switchMap(() => {
          let items: any[] = [];
          try {
            const raw =
              typeof localStorage !== 'undefined' ? localStorage.getItem('guestCart') : null;
            const cart = raw ? JSON.parse(raw) : null;
            items = cart?.items || [];
          } catch {}

          if (!items.length) {
            this.snack.open('Connexion réussie', undefined, { duration: 2000 });
            return of(null);
          }

          const calls = items.map((it: any) =>
            this.cartService
              .cartItemsPost({
                productId: it?.product?.id ?? it?.itemId,
                quantity: it?.quantity ?? 1,
              })
              .pipe(catchError(() => of(null))),
          );

          return forkJoin(calls).pipe(
            tap(() => {
              try {
                localStorage.removeItem('guestCart');
              } catch {}
              this.snack.open('Connexion réussie • Panier invité migré', undefined, {
                duration: 2500,
              });
            }),
            catchError(() => {
              this.snack.open('Connexion réussie', undefined, { duration: 2000 });
              return of(null);
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  // Login failure toast
  loginFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          const msg = error || 'Connexion échouée';
          this.snack.open(msg, undefined, { duration: 3000 });
        }),
      ),
    { dispatch: false },
  );

  // Register feedback toasts
  registerSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.snack.open('Inscription réussie', undefined, { duration: 2500 })),
      ),
    { dispatch: false },
  );

  registerFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Inscription échouée', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );

  // Logout feedback toast
  logoutToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.snack.open('Déconnecté', undefined, { duration: 1500 })),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ payload }: { payload: RegisterRequest }) =>
        this.authService.authRegisterPost(payload).pipe(
          map((user) => AuthActions.registerSuccess({ user })),
          catchError((err) =>
            of(AuthActions.registerFailure({ error: AuthEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.authLogoutPost().pipe(
          catchError(() => of(null)), // ignore server logout failures
          tap(() => {
            try {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
            } catch {
              // ignore storage errors
            }
          }),
          map(() => AuthActions.hydrateComplete({ user: null, accessToken: null })),
          tap(() => this.router.navigateByUrl('/login')),
        ),
      ),
    ),
  );

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.hydrate),
      map(() => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const userRaw = localStorage.getItem('user');
          const user = userRaw ? JSON.parse(userRaw) : null;
          return AuthActions.hydrateComplete({ user, accessToken });
        } catch {
          return AuthActions.hydrateComplete({ user: null, accessToken: null });
        }
      }),
    ),
  );

  // PANIER: load user's panier on login
  loadPanierOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(({ response }) => {
        const clientCode = (response?.user as any)?.id || (response?.user as any)?.email || '';
        return PanierActions.getByClient({ clientCode });
      }),
    ),
  );

  // PANIER: if no panier found for client, create one automatically
  createPanierIfMissing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.getByClientFailure),
      map(() => {
        let clientCode = '';
        try {
          const userRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
          const user = userRaw ? JSON.parse(userRaw) : null;
          clientCode = user?.id || user?.email || 'guest';
        } catch {}
        const code = clientCode || 'guest';
        return PanierActions.create({
          request: { panierCode: code, clientCode: code, state: 'ACTIVE' } as any,
        });
      }),
    ),
  );
}
