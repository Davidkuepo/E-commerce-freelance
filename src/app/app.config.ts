import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideApi } from './api/provide-api';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { authFeature } from './store/auth/auth.store';
import { AuthEffects } from './store/auth/auth.effects';
import { panierFeature } from './store/panier/panier.store';
import { PanierEffects } from './store/panier/panier.effects';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideApi('http://217.77.8.234:9600/api'),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    provideStore(),
    provideState(authFeature),
    provideEffects(AuthEffects),
    provideState(panierFeature),
    provideEffects(PanierEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
