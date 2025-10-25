import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AuthActions, selectError, selectStatus } from '../../store/auth/auth.store';
import { TextInputWrapper, EmailInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    EmailInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-sky-500 to-cyan-600 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center"
              >
                <mat-icon>mark_email_unread</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Vérification d'email</div>
                <div class="text-sm text-gray-600">Validez votre email à l’aide d’un jeton</div>
              </div>
            </div>

            <div class="p-6 space-y-6">
              <form class="space-y-4" (submit)="onVerify($event)">
                <app-text-input
                  label="Jeton de vérification"
                  [value]="token()"
                  (valueChange)="token.set($event)"
                  placeholder="Collez ici le token reçu par email"
                  [error]="tokenError() || (error$ | async) || null"
                ></app-text-input>

                <div class="flex items-center justify-between">
                  <a
                    routerLink="/login"
                    class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                  >
                    <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                  </a>
                  <app-button
                    color="primary"
                    type="submit"
                    [loading]="(isLoading$ | async) ?? false"
                    >Vérifier l'email</app-button
                  >
                </div>
              </form>

              <div class="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <div class="flex items-start gap-2">
                  <mat-icon class="!text-base text-amber-600 mt-0.5">info</mat-icon>
                  <div class="text-sm text-gray-700">
                    Vous n'avez pas reçu de token ? Envoyez-en un nouveau à votre adresse email.
                  </div>
                </div>
                <form class="mt-3 flex flex-col gap-3 md:flex-row" (submit)="onSendToken($event)">
                  <div class="flex-1">
                    <app-email-input
                      label="Votre email"
                      [value]="email()"
                      (valueChange)="email.set($event)"
                      [error]="emailError() || (error$ | async) || null"
                    ></app-email-input>
                  </div>
                  <div class="md:self-end">
                    <app-button
                      color="accent"
                      type="submit"
                      [loading]="(isLoading$ | async) ?? false"
                      >Envoyer le token</app-button
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class VerifyEmailPage {
  private readonly store = inject(Store);

  token = signal<string>('');
  email = signal<string>('');

  tokenError = signal<string | null>(null);
  emailError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onVerify(e: Event) {
    e.preventDefault();
    this.tokenError.set(null);

    const t = (this.token() || '').trim();
    if (!t) {
      this.tokenError.set('Veuillez saisir le jeton de vérification');
      return;
    }
    this.store.dispatch(AuthActions.verifyEmail({ payload: { token: t } as any }));
  }

  onSendToken(e: Event) {
    e.preventDefault();
    this.emailError.set(null);

    const em = (this.email() || '').trim();
    if (!em) {
      this.emailError.set('Veuillez saisir votre email');
      return;
    }
    this.store.dispatch(AuthActions.sendTokenVerifyEmail({ payload: { userEmail: em } as any }));
  }
}
