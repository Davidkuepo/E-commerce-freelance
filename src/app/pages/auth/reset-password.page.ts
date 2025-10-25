import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AuthActions, selectError, selectStatus } from '../../store/auth/auth.store';
import { TextInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, TextInputWrapper, ButtonWrapper, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-cyan-600 to-emerald-500 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
              >
                <mat-icon>password</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Réinitialiser le mot de passe</div>
                <div class="text-sm text-gray-600">
                  Collez le jeton reçu et définissez un nouveau mot de passe
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onReset($event)">
              <app-text-input
                label="Jeton"
                [value]="token()"
                (valueChange)="token.set($event)"
                placeholder="Token reçu par email"
                [error]="tokenError() || (error$ | async) || null"
              ></app-text-input>

              <app-text-input
                label="Nouveau mot de passe"
                [type]="'password'"
                [value]="password()"
                (valueChange)="password.set($event)"
                placeholder="Au moins 6 caractères"
                [error]="passwordError() || (error$ | async) || null"
              ></app-text-input>

              <div class="rounded-md border p-3 text-xs text-gray-600">
                Conseil: utilisez une phrase secrète et activez la vérification en deux étapes si
                disponible.
              </div>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit" [loading]="(isLoading$ | async) ?? false"
                  >Mettre à jour</app-button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ResetPasswordPage {
  private readonly store = inject(Store);

  token = signal<string>('');
  password = signal<string>('');

  tokenError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onReset(e: Event) {
    e.preventDefault();
    this.tokenError.set(null);
    this.passwordError.set(null);

    const t = (this.token() || '').trim();
    const p = (this.password() || '').trim();
    if (!t) {
      this.tokenError.set('Renseignez le token');
    }
    if (!p) {
      this.passwordError.set('Renseignez le nouveau mot de passe');
    }
    if (!t || !p) {
      return;
    }
    this.store.dispatch(AuthActions.resetPassword({ payload: { token: t, password: p } as any }));
  }
}
