import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AuthActions, selectError, selectStatus } from '../../store/auth/auth.store';
import { EmailInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-request-reset-token',
  standalone: true,
  imports: [CommonModule, RouterLink, EmailInputWrapper, ButtonWrapper, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-rose-500 via-amber-500 to-cyan-600 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center"
              >
                <mat-icon>lock_reset</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Mot de passe oublié</div>
                <div class="text-sm text-gray-600">
                  Recevez un jeton de réinitialisation par email
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onSend($event)">
              <app-email-input
                label="Votre email"
                [value]="email()"
                (valueChange)="email.set($event)"
                [error]="emailError() || (error$ | async) || null"
              ></app-email-input>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit" [loading]="(isLoading$ | async) ?? false">
                  Envoyer le jeton
                </app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class RequestResetTokenPage {
  private readonly store = inject(Store);

  email = signal<string>('');
  emailError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onSend(e: Event) {
    e.preventDefault();
    this.emailError.set(null);

    const em = (this.email() || '').trim();
    if (!em) {
      this.emailError.set('Veuillez saisir votre email');
      return;
    }
    this.store.dispatch(AuthActions.sendTokenResetPassword({ userEmail: em }));
  }
}
