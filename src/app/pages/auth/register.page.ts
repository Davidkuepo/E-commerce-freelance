import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions, selectStatus, selectError } from '../../store/auth/auth.store';
import { RegisterRequest } from '../../api';
import { EmailInputWrapper, TextInputWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, EmailInputWrapper, TextInputWrapper, ButtonWrapper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container mx-auto py-8 max-w-md">
      <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>

      <form (submit)="onSubmit($event)" class="space-y-4">
        <app-text-input
          label="Nom"
          [value]="name()"
          (valueChange)="name.set($event)"
          [error]="nameError()"
        ></app-text-input>

        <app-email-input
          label="Email"
          [value]="email()"
          (valueChange)="email.set($event)"
          [error]="emailError() || (error$ | async) || null"
        ></app-email-input>

        <app-text-input
          label="Mot de passe"
          [type]="'password'"
          [value]="password()"
          (valueChange)="password.set($event)"
          [error]="passwordError() || (error$ | async) || null"
        ></app-text-input>

        <app-button
          color="primary"
          [fullWidth]="true"
          type="submit"
          [loading]="(isLoading$ | async) ?? false"
        >
          S'inscrire
        </app-button>
      </form>

      <p class="text-sm text-gray-600 mt-4">
        Déjà un compte ?
        <a routerLink="/login" class="text-cyan-700 font-medium hover:underline">Se connecter</a>
      </p>
    </section>
  `,
})
export class RegisterPage {
  private readonly store = inject(Store);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  nameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onSubmit(e: Event) {
    e.preventDefault();

    // reset local errors
    this.nameError.set(null);
    this.emailError.set(null);
    this.passwordError.set(null);

    const name = (this.name() || '').trim();
    const email = (this.email() || '').trim();
    const password = (this.password() || '').trim();

    let hasError = false;
    if (!name) {
      this.nameError.set('Le nom est requis');
      hasError = true;
    }
    if (!email) {
      this.emailError.set("L'email est requis");
      hasError = true;
    }
    if (!password) {
      this.passwordError.set('Le mot de passe est requis');
      hasError = true;
    }
    if (hasError) return;

    const payload: RegisterRequest = { name, email, password };
    this.store.dispatch(AuthActions.register({ payload }));
  }
}
