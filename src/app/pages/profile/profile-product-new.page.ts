import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TextInputWrapper, TextAreaWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { ProduitService } from '../../api/api/produit.service';

@Component({
  selector: 'app-profile-product-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    TextAreaWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="container mx-auto py-12 max-w-5xl">
      <div class="rounded-3xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        <!-- Header -->
        <header
          class="relative bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-500 text-white px-8 py-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"
            >
              <mat-icon class="!text-3xl text-white">add_box</mat-icon>
            </div>
            <div>
              <h1 class="text-2xl font-semibold leading-tight">Créer un nouveau produit</h1>
              <p class="text-sm opacity-80">
                Remplissez les champs pour ajouter un produit à votre boutique.
              </p>
            </div>
          </div>
        </header>

        <!-- Body -->
        <div class="p-8 bg-gray-50">
          <!-- Enregistrement -->
          <div
            *ngIf="isSaving()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 mb-6"
          >
            <mat-icon class="!text-base animate-spin">autorenew</mat-icon>
            <span>Enregistrement en cours...</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Formulaire -->
            <form class="space-y-6" (submit)="onSubmit($event)">
              <!-- Informations principales -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-text-input
                    label="Code produit"
                    [value]="produitCode()"
                    (valueChange)="produitCode.set($event)"
                  >
                  </app-text-input>

                  <app-text-input
                    label="Nom du produit"
                    [value]="name()"
                    (valueChange)="name.set($event)"
                  >
                  </app-text-input>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-text-input
                    label="Prix (€)"
                    [type]="'number'"
                    [value]="price()"
                    (valueChange)="price.set($event)"
                  >
                  </app-text-input>

                  <app-text-input
                    label="Stock"
                    [type]="'number'"
                    [value]="stock()"
                    (valueChange)="stock.set($event)"
                  >
                  </app-text-input>
                </div>

                <app-text-input
                  label="Catégorie"
                  [value]="categorie()"
                  (valueChange)="categorie.set($event)"
                >
                </app-text-input>

                <!-- État -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >État du produit</label
                  >
                  <select
                    class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    [value]="state()"
                    (change)="state.set($any($event.target).value || 'ACTIVE')"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>

                <app-textarea
                  label="Description"
                  [value]="description()"
                  (valueChange)="description.set($event)"
                >
                </app-textarea>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-6">
                <a
                  routerLink="/profile/products"
                  class="text-sm text-gray-600 hover:text-cyan-600 transition flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon>
                  <span>Retour</span>
                </a>

                <app-button
                  color="primary"
                  type="submit"
                  class="!bg-cyan-600 hover:!bg-cyan-700 text-white rounded-lg shadow-lg px-8 py-2.5 transition-transform hover:-translate-y-0.5 duration-300"
                  [class.opacity-60]="isSaving()"
                  [class.pointer-events-none]="isSaving()"
                >
                  <mat-icon class="!text-base mr-2">save</mat-icon>
                  Enregistrer
                </app-button>
              </div>
            </form>

            <!-- Aperçu -->
            <div class="hidden md:block">
              <div class="sticky top-20 bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Aperçu du produit</h3>
                <div
                  class="aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-4"
                >
                  <mat-icon class="!text-6xl text-gray-400">image</mat-icon>
                </div>
                <h4 class="text-gray-800 font-medium text-lg">{{ name() || 'Nom du produit' }}</h4>
                <p class="text-sm text-gray-500 mb-2">{{ categorie() || 'Catégorie' }}</p>
                <p class="text-cyan-600 font-semibold text-lg">
                  {{ price() || 0 | currency: 'EUR' : 'symbol' : '1.2-2' }}
                </p>
                <p class="text-sm text-gray-500 mt-1">Stock : {{ stock() || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProductNewPage {
  private readonly produitService = inject(ProduitService);
  private readonly snack = inject(MatSnackBar);

  produitCode = signal<string>('');
  name = signal<string>('');
  price = signal<string>('0');
  stock = signal<string>('0');
  categorie = signal<string>('');
  state = signal<string>('ACTIVE');
  description = signal<string>('');
  isSaving = signal<boolean>(false);

  onSubmit(e: Event) {
    e.preventDefault();
    const data: any = {
      produitCode: (this.produitCode() || '').trim(),
      nom: (this.name() || '').trim(),
      description: (this.description() || '').trim(),
      prix: Number(this.price() || 0),
      stock: Number(this.stock() || 0),
      categorie: (this.categorie() || '').trim(),
      state: (this.state() || 'ACTIVE').toUpperCase(),
    };
    if (!data.produitCode) {
      this.snack.open('Veuillez renseigner le code produit', undefined, { duration: 2500 });
      return;
    }
    if (!data.nom) {
      this.snack.open('Veuillez renseigner le nom du produit', undefined, { duration: 2500 });
      return;
    }
    this.isSaving.set(true);
    try {
      this.produitService.produitCreatePost(data as any).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snack.open('Produit créé', undefined, { duration: 2500 });
        },
        error: () => {
          this.isSaving.set(false);
          this.snack.open('Échec de la création du produit', undefined, { duration: 3000 });
        },
      });
    } catch {
      this.isSaving.set(false);
      this.snack.open('Échec de la création du produit', undefined, { duration: 3000 });
    }
  }
}
