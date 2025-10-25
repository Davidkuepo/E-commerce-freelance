import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthActions, selectStatus, selectError } from '../../store/auth/auth.store';
import { LoginRequest } from '../../api';
import { EmailInputWrapper, TextInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmailInputWrapper,
    TextInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container mx-auto py-8">
      <div
        class="flex flex-col md:flex-row h-[700px] w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg"
      >
        <div class="relative w-full md:w-1/2 h-64 md:h-auto block bg-gray-100">
          <img
            loading="eager"
            class="h-full w-full object-cover"
            src="https://picsum.photos/id/0/1200/700"
            alt="Laptop product"
          />
        </div>

        <div class="w-full flex flex-col items-center justify-start px-4 pt-16 md:pt-24">
          <form
            class="md:w-96 w-80 flex flex-col items-center justify-center"
            (submit)="onSubmit($event)"
          >
            <h2 class="text-4xl text-gray-900 font-medium">Sign in</h2>
            <p class="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>

            <button
              type="button"
              class="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div class="flex items-center gap-4 w-full my-5">
              <div class="w-full h-px bg-gray-300/90"></div>
              <p class="w-full text-nowrap text-sm text-gray-500/90">or sign in with email</p>
              <div class="w-full h-px bg-gray-300/90"></div>
            </div>

            <!-- Email (custom wrapper shows error) -->
            <app-email-input
              label="Email"
              [value]="email()"
              (valueChange)="email.set($event)"
              [error]="(error$ | async) || null"
            ></app-email-input>

            <!-- Password (custom wrapper shows error) -->
            <div class="w-full mt-4">
              <app-text-input
                label="Password"
                [type]="'password'"
                [value]="password()"
                (valueChange)="password.set($event)"
                [error]="(error$ | async) || null"
                [suffixIcon]="'lock'"
              ></app-text-input>
            </div>

            <div class="w-full flex items-center justify-between mt-4 text-gray-500/80">
              <div class="flex items-center gap-2">
                <input
                  class="h-5"
                  type="checkbox"
                  id="checkbox"
                  [checked]="rememberMe()"
                  (change)="onRememberChange($event)"
                />
                <label class="text-sm" for="checkbox">Remember me</label>
              </div>
              <a class="text-sm underline" [routerLink]="['/forgot-password']">Forgot password?</a>
            </div>

            <div class="w-full mt-6">
              <app-button
                color="primary"
                [fullWidth]="true"
                type="submit"
                [loading]="(isLoading$ | async) ?? false"
                icon="login"
              >
                Login
              </app-button>
            </div>

            <p class="text-gray-500/90 text-sm mt-4">
              Don’t have an account?
              <a class="text-indigo-400 hover:underline" [routerLink]="['/register']">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class LoginPage {
  private readonly store = inject(Store);

  email = signal<string>('');
  password = signal<string>('');
  rememberMe = signal<boolean>(false);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onRememberChange(e: Event) {
    const checked = !!(e.target as HTMLInputElement)?.checked;
    this.rememberMe.set(checked);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const creds: LoginRequest = { email: this.email(), password: this.password() };
    this.store.dispatch(AuthActions.login({ credentials: creds }));
  }
}
