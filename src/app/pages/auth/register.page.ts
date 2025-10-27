import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions, selectStatus, selectError } from '../../store/auth/auth.store';
import { RegisterRequest } from '../../api';
import {
  EmailInputWrapper,
  TextInputWrapper,
  TextAreaWrapper,
  ButtonWrapper,
} from '../../components/form/wrappers';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmailInputWrapper,
    TextInputWrapper,
    TextAreaWrapper,
    ButtonWrapper,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-screen-lg px-4 py-6 sm:py-8">
      <div
        class="flex flex-col md:flex-row w-full md:min-h-[560px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg"
      >
        <!-- Visual (left) -->
        <div class="relative w-full md:w-1/2 h-48 sm:h-64 md:h-auto block bg-gray-100">
          <img
            loading="eager"
            class="h-full w-full object-cover"
            src="https://picsum.photos/id/1/1200/700"
            alt="Sign up illustration"
          />
        </div>

        <!-- Form (right) -->
        <div class="w-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
          <form
            class="w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center justify-center"
            (submit)="onSubmit($event)"
          >
            <h2 class="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-medium">Sign up</h2>
            <p class="text-sm text-gray-500/90 mt-3">Create your account to continue</p>

            <!-- Social (placeholder) -->
            <button
              type="button"
              class="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
              aria-label="Sign up with Google"
            >
              <img
                class="h-5"
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <!-- Divider -->
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full my-5">
              <div class="h-px bg-gray-300/90"></div>
              <p class="text-center text-xs sm:text-sm text-gray-500/90 px-1">
                or sign up with email
              </p>
              <div class="h-px bg-gray-300/90"></div>
            </div>

            <!-- Name -->
            <div class="w-full">
              <app-text-input
                label="Nom"
                [value]="name()"
                (valueChange)="name.set($event)"
                [error]="nameError()"
                suffixIcon="badge"
              ></app-text-input>
            </div>

            <!-- First name -->
            <div class="w-full mt-4">
              <app-text-input
                label="Prénom"
                [value]="prenom()"
                (valueChange)="prenom.set($event)"
                [error]="prenomError()"
                suffixIcon="badge"
              ></app-text-input>
            </div>

            <!-- Email -->
            <div class="w-full mt-4">
              <app-email-input
                label="Email"
                [value]="email()"
                (valueChange)="email.set($event)"
                [error]="emailError() || (error$ | async) || null"
              ></app-email-input>
            </div>

            <!-- Téléphone -->
            <div class="w-full mt-4">
              <app-text-input
                label="Téléphone"
                [value]="telephone()"
                (valueChange)="telephone.set($event)"
                [error]="telephoneError()"
                suffixIcon="phone"
              ></app-text-input>
            </div>

            <!-- Password -->
            <div class="w-full mt-4">
              <app-text-input
                label="Mot de passe"
                [type]="'password'"
                [value]="password()"
                (valueChange)="password.set($event)"
                [error]="passwordError() || (error$ | async) || null"
                [suffixIcon]="'lock'"
              ></app-text-input>
            </div>

            <!-- Adresse -->
            <div class="w-full mt-4">
              <app-textarea
                label="Adresse"
                [value]="adresse()"
                (valueChange)="adresse.set($event)"
                [error]="adresseError()"
                [rows]="3"
              ></app-textarea>
            </div>

            <!-- Submit -->
            <div class="w-full mt-6">
              <app-button
                color="primary"
                [fullWidth]="true"
                type="submit"
                [loading]="(isLoading$ | async) ?? false"
                icon="person_add"
              >
                S'inscrire
              </app-button>
            </div>

            <!-- Link to login -->
            <p class="text-gray-500/90 text-sm mt-4">
              Déjà un compte ?
              <a class="text-indigo-400 hover:underline" [routerLink]="['/login']">Se connecter</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class RegisterPage {
  private readonly store = inject(Store);

  name = signal<string>('');
  prenom = signal<string>('');
  email = signal<string>('');
  telephone = signal<string>('');
  adresse = signal<string>('');
  password = signal<string>('');

  nameError = signal<string | null>(null);
  prenomError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  telephoneError = signal<string | null>(null);
  adresseError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onSubmit(e: Event) {
    e.preventDefault();

    // reset local errors
    this.nameError.set(null);
    this.prenomError.set(null);
    this.emailError.set(null);
    this.telephoneError.set(null);
    this.adresseError.set(null);
    this.passwordError.set(null);

    const nom = (this.name() || '').trim();
    const prenom = (this.prenom() || '').trim();
    const email = (this.email() || '').trim();
    const telephone = (this.telephone() || '').trim();
    const adresse = (this.adresse() || '').trim();
    const password = (this.password() || '').trim();

    let hasError = false;
    if (!nom) {
      this.nameError.set('Le nom est requis');
      hasError = true;
    }
    if (!prenom) {
      this.prenomError.set('Le prénom est requis');
      hasError = true;
    }
    if (!email) {
      this.emailError.set("L'email est requis");
      hasError = true;
    }
    if (!telephone) {
      this.telephoneError.set('Le téléphone est requis');
      hasError = true;
    }
    if (!adresse) {
      this.adresseError.set("L'adresse est requise");
      hasError = true;
    }
    if (!password) {
      this.passwordError.set('Le mot de passe est requis');
      hasError = true;
    }
    if (hasError) return;

    // Map to backend RegisterRequest (captures name, email, password)
    const displayName = `${prenom} ${nom}`.trim();
    const payload: RegisterRequest = { name: displayName, email, password };
    this.store.dispatch(AuthActions.register({ payload }));
    // TODO: Send téléphone/adresse to api/client/create when available
  }
}
