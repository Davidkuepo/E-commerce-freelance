import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiResponsePanier, Panier, PanierCreateRequest } from '../../api';

export interface PanierState {
  panier: Panier | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export const initialPanierState: PanierState = {
  panier: null,
  status: 'idle',
  error: null,
};

export const PanierActions = createActionGroup({
  source: 'Panier',
  events: {
    create: props<{ request: PanierCreateRequest }>(),
    createSuccess: props<{ response: ApiResponsePanier }>(),
    createFailure: props<{ error: string }>(),

    getByClient: props<{ clientCode: string }>(),
    getByClientSuccess: props<{ response: ApiResponsePanier }>(),
    getByClientFailure: props<{ error: string }>(),

    addProduct: props<{ panierCode: string; produitCode: string; quantite: number }>(),
    addProductSuccess: props<{ response: ApiResponsePanier }>(),
    addProductFailure: props<{ error: string }>(),

    removeProduct: props<{ panierCode: string; produitCode: string }>(),
    removeProductSuccess: props<{ response: ApiResponsePanier }>(),
    removeProductFailure: props<{ error: string }>(),

    clear: props<{ panierCode: string }>(),
    clearSuccess: props<{ response: ApiResponsePanier }>(),
    clearFailure: props<{ error: string }>(),

    resetError: emptyProps(),
  },
});

function extractPanier(response: ApiResponsePanier | null | undefined): Panier | null {
  try {
    return (response as any)?.data ?? null;
  } catch {
    return null;
  }
}

export const panierReducer = createReducer(
  initialPanierState,

  on(PanierActions.create, (state) => ({ ...state, status: 'loading', error: null })),
  on(PanierActions.createSuccess, (state, { response }) => ({
    ...state,
    panier: extractPanier(response),
    status: 'success',
    error: null,
  })),
  on(PanierActions.createFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(PanierActions.getByClient, (state) => ({ ...state, status: 'loading', error: null })),
  on(PanierActions.getByClientSuccess, (state, { response }) => ({
    ...state,
    panier: extractPanier(response),
    status: 'success',
    error: null,
  })),
  on(PanierActions.getByClientFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(PanierActions.addProduct, (state) => ({ ...state, status: 'loading', error: null })),
  on(PanierActions.addProductSuccess, (state, { response }) => ({
    ...state,
    panier: extractPanier(response),
    status: 'success',
    error: null,
  })),
  on(PanierActions.addProductFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(PanierActions.removeProduct, (state) => ({ ...state, status: 'loading', error: null })),
  on(PanierActions.removeProductSuccess, (state, { response }) => ({
    ...state,
    panier: extractPanier(response),
    status: 'success',
    error: null,
  })),
  on(PanierActions.removeProductFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(PanierActions.clear, (state) => ({ ...state, status: 'loading', error: null })),
  on(PanierActions.clearSuccess, (state, { response }) => ({
    ...state,
    panier: extractPanier(response),
    status: 'success',
    error: null,
  })),
  on(PanierActions.clearFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(PanierActions.resetError, (state) => ({ ...state, error: null })),
);

export const panierFeature = createFeature({
  name: 'panier',
  reducer: panierReducer,
});

export const selectPanierState = panierFeature.selectPanierState;
export const selectPanierData = panierFeature.selectPanier;
export const selectPanierStatus = panierFeature.selectStatus;
export const selectPanierError = panierFeature.selectError;
