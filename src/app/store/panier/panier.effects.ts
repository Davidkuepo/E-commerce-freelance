import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PanierActions } from './panier.store';
import { PanierService } from '../../api/api/panier.service';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class PanierEffects {
  private readonly actions$ = inject(Actions);
  private readonly panierService = inject(PanierService);
  private readonly snack = inject(MatSnackBar);

  private static toErrorMessage(err: unknown): string {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    const anyErr = err as any;
    if (anyErr?.error?.message) return String(anyErr.error.message);
    if (anyErr?.message) return String(anyErr.message);
    return 'Request failed';
  }

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.create),
      exhaustMap(({ request }) =>
        this.panierService.panierCreatePost(request).pipe(
          map((response) => PanierActions.createSuccess({ response })),
          catchError((err) =>
            of(PanierActions.createFailure({ error: PanierEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  createSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.createSuccess),
        tap(() => this.snack.open('Panier créé', undefined, { duration: 2000 })),
      ),
    { dispatch: false },
  );

  createFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.createFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Échec création panier', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );

  getByClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.getByClient),
      exhaustMap(({ clientCode }) =>
        this.panierService.panierByClientGet(clientCode).pipe(
          map((response) => PanierActions.getByClientSuccess({ response })),
          catchError((err) =>
            of(PanierActions.getByClientFailure({ error: PanierEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  getByClientFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.getByClientFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Échec chargement panier', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.addProduct),
      exhaustMap(({ panierCode, produitCode, quantite }) =>
        this.panierService.panierAddProductPost(panierCode, produitCode, quantite).pipe(
          map((response) => PanierActions.addProductSuccess({ response })),
          catchError((err) =>
            of(PanierActions.addProductFailure({ error: PanierEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  addProductSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.addProductSuccess),
        tap(() => this.snack.open('Produit ajouté au panier', undefined, { duration: 2000 })),
      ),
    { dispatch: false },
  );

  addProductFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.addProductFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Ajout au panier impossible', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );

  removeProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.removeProduct),
      exhaustMap(({ panierCode, produitCode }) =>
        this.panierService.panierRemoveProductDelete(panierCode, produitCode).pipe(
          map((response) => PanierActions.removeProductSuccess({ response })),
          catchError((err) =>
            of(PanierActions.removeProductFailure({ error: PanierEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  removeProductSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.removeProductSuccess),
        tap(() => this.snack.open('Article retiré du panier', undefined, { duration: 2000 })),
      ),
    { dispatch: false },
  );

  removeProductFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.removeProductFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Échec suppression article', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );

  clear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanierActions.clear),
      exhaustMap(({ panierCode }) =>
        this.panierService.panierClearDelete(panierCode).pipe(
          map((response) => PanierActions.clearSuccess({ response })),
          catchError((err) =>
            of(PanierActions.clearFailure({ error: PanierEffects.toErrorMessage(err) })),
          ),
        ),
      ),
    ),
  );

  clearSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.clearSuccess),
        tap(() => this.snack.open('Panier vidé', undefined, { duration: 2000 })),
      ),
    { dispatch: false },
  );

  clearFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanierActions.clearFailure),
        tap(({ error }) =>
          this.snack.open(error || 'Échec vidage panier', undefined, { duration: 3000 }),
        ),
      ),
    { dispatch: false },
  );
}
