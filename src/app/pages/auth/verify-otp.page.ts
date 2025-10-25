import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { AuthActions, selectError, selectStatus } from '../../store/auth/auth.store';
import { TextInputWrapper, EmailInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    EmailInputWrapper,
    ButtonWrapper,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-br from-cyan-600 via-sky-600 to-emerald-500 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center"
              >
                <mat-icon>key</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Vérification OTP</div>
                <div class="text-sm text-gray-600">
                  Entrez le code reçu pour valider votre session
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onVerify($event)">
              <app-text-input
                label="Code OTP"
                [value]="otp()"
                (valueChange)="otp.set($event)"
                placeholder="Ex: 123456"
                [error]="otpError() || (error$ | async) || null"
              ></app-text-input>

              <div class="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <div class="text-sm text-gray-700 mb-3">
                  Besoin d'un nouveau code ? Renseignez votre identifiant et renvoyez l'OTP.
                </div>
                <app-text-input
                  label="Identifiant (email ou login)"
                  [value]="login()"
                  (valueChange)="login.set($event)"
                  placeholder="email@domaine.com"
                  [error]="loginError() || (error$ | async) || null"
                ></app-text-input>
                <div class="mt-3">
                  <app-button
                    color="accent"
                    (clicked)="onResendOtp()"
                    [loading]="(isLoading$ | async) ?? false"
                    >Renvoyer OTP</app-button
                  >
                </div>
              </div>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit" [loading]="(isLoading$ | async) ?? false"
                  >Vérifier</app-button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class VerifyOtpPage {
  private readonly store = inject(Store);

  otp = signal<string>('');
  login = signal<string>('');

  otpError = signal<string | null>(null);
  loginError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onVerify(e: Event) {
    e.preventDefault();
    this.otpError.set(null);

    const code = (this.otp() || '').trim();
    if (!code) {
      this.otpError.set('Veuillez saisir le code OTP');
      return;
    }
    this.store.dispatch(AuthActions.verifyOtp({ payload: { otpCode: code } as any }));
  }

  onResendOtp() {
    this.loginError.set(null);

    let login = (this.login() || '').trim();
    if (!login) {
      try {
        const raw = localStorage.getItem('user');
        const u = raw ? JSON.parse(raw) : null;
        login = u?.email || u?.username || '';
      } catch {}
    }
    if (!login) {
      this.loginError.set('Renseignez votre email/login pour renvoyer l’OTP');
      return;
    }
    this.store.dispatch(AuthActions.resendOtp({ login }));
  }
}
