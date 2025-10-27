import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TextInputWrapper, TextAreaWrapper, ButtonWrapper } from '../../components/form/wrappers';
import { ProduitService } from '../../api/api/produit.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BASE_PATH } from '../../api/variables';

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
    HttpClientModule,
  ],
  template: `
    <section class="min-h-screen bg-slate-50 py-8 px-4">
      <div class="container mx-auto max-w-7xl">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-6">
          <a routerLink="/profile" class="text-gray-500 hover:text-cyan-600 transition-colors flex items-center gap-1">
            <mat-icon class="!text-base">home</mat-icon>
            <span>Profil</span>
          </a>
          <mat-icon class="!text-base text-gray-400">chevron_right</mat-icon>
          <a routerLink="/profile/products" class="text-gray-500 hover:text-cyan-600 transition-colors">
            Produits
          </a>
          <mat-icon class="!text-base text-gray-400">chevron_right</mat-icon>
          <span class="text-gray-900 font-medium">Nouveau produit</span>
        </nav>

        <!-- Main -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100">

          <!-- Header -->
          <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <mat-icon class="!text-2xl">inventory_2</mat-icon>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ isEdit() ? 'Modifier le produit' : 'Créer un nouveau produit' }}</h1>
                <p class="text-gray-500 text-sm">Ajoutez un produit à votre catalogue rapidement</p>
              </div>
            </div>

            <a
              routerLink="/profile/products"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <mat-icon class="!text-base">arrow_back</mat-icon>
              <span>Retour</span>
            </a>
          </div>

          <!-- Saving -->
          <div *ngIf="isSaving()" class="px-6 py-3 bg-emerald-50 border-b border-emerald-200 text-emerald-700 flex items-center gap-3">
            <span class="inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
            <span class="font-medium">Enregistrement en cours...</span>
          </div>

          <!-- Content -->
          <div class="p-6 lg:p-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <!-- Form -->
              <div class="lg:col-span-2">
                <form (submit)="onSubmit($event)" class="space-y-8">

                  <!-- Section: Détails -->
                  <section class="rounded-xl border border-gray-200 p-6 bg-gray-50/40">
                    <header class="flex items-center gap-3 mb-6">
                      <div class="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
                        <mat-icon class="!text-lg">info</mat-icon>
                      </div>
                      <h2 class="text-lg font-semibold text-gray-900">Détails du produit</h2>
                    </header>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div class="space-y-1">
                        <app-text-input
                          label="Code produit"
                          [placeholder]="'Ex: PRD-0001'"
                          [value]="produitCode()"
                          (valueChange)="produitCode.set($event)"
                          suffixIcon="qr_code_2"
                        ></app-text-input>
                        <button
                          type="button"
                          class="text-xs text-cyan-700 hover:text-cyan-800 underline"
                          (click)="regenerateCode()"
                        >
                          Regénérer automatiquement
                        </button>
                      </div>

                      <app-text-input
                        label="Nom du produit"
                        [placeholder]="'Ex: T-shirt premium'"
                        [value]="name()"
                        (valueChange)="name.set($event)"
                        suffixIcon="label"
                      ></app-text-input>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <app-text-input
                        label="Catégorie"
                        [placeholder]="'Ex: Vêtements'"
                        [value]="categorie()"
                        (valueChange)="categorie.set($event)"
                        suffixIcon="category"
                      ></app-text-input>
                    </div>

                    <div class="mt-5">
                      <app-textarea
                        label="Description"
                        [placeholder]="'Décrivez le produit...'"
                        [value]="description()"
                        (valueChange)="description.set($event)"
                        [rows]="5"
                      ></app-textarea>
                    </div>
                  </section>

                  <!-- Section: Tarification -->
                  <section class="rounded-xl border border-gray-200 p-6 bg-gray-50/40">
                    <header class="flex items-center gap-3 mb-6">
                      <div class="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <mat-icon class="!text-lg">euro</mat-icon>
                      </div>
                      <h2 class="text-lg font-semibold text-gray-900">Tarification & Stock</h2>
                    </header>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <app-text-input
                        label="Prix (€)"
                        [type]="'number'"
                        [placeholder]="'0.00'"
                        [value]="price()"
                        (valueChange)="price.set($event)"
                        suffixIcon="payments"
                      ></app-text-input>

                      <app-text-input
                        label="Stock disponible"
                        [type]="'number'"
                        [placeholder]="'0'"
                        [value]="stock()"
                        (valueChange)="stock.set($event)"
                        suffixIcon="inventory_2"
                      ></app-text-input>
                    </div>
                  </section>

                  <!-- Section: Statut -->
                  <section class="rounded-xl border border-gray-200 p-6 bg-gray-50/40">
                    <header class="flex items-center gap-3 mb-6">
                      <div class="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                        <mat-icon class="!text-lg">toggle_on</mat-icon>
                      </div>
                      <h2 class="text-lg font-semibold text-gray-900">État & Disponibilité</h2>
                    </header>

                    <label class="block text-sm font-medium text-gray-700 mb-2">Statut du produit</label>
                    <div class="relative">
                      <select
                        class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        [value]="state()"
                        (change)="state.set($any($event.target).value || 'ACTIVE')"
                      >
                        <option value="ACTIVE">✅ Actif - Visible sur la boutique</option>
                        <option value="INACTIVE">⛔ Inactif - Masqué de la boutique</option>
                      </select>
                      <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</mat-icon>
                    </div>
                  </section>

                  <!-- Actions -->
                  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
                    <a
                      routerLink="/profile/products"
                      class="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <mat-icon class="!text-base">close</mat-icon>
                      <span>Annuler</span>
                    </a>

                    <app-button
                      color="primary"
                      [type]="'submit'"
                      [loading]="isSaving()"
                      [disabled]="isSaving()"
                      icon="check_circle"
                    >
                      Enregistrer le produit
                    </app-button>
                  </div>
                </form>
              </div>

              <!-- Upload images (Drag & Drop) -->
              <aside class="lg:col-span-1">
                <div class="sticky top-6 space-y-4">
                  <!-- Dropzone -->
                  <div
                    class="rounded-xl border-2 border-dashed transition-colors"
                    [class.border-cyan-400]="dragActive()"
                    [class.bg-cyan-50/40]="dragActive()"
                    [class.border-gray-300]="!dragActive()"
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onDrop($event)"
                  >
                    <div class="p-6 flex flex-col items-center justify-center text-center gap-3">
                      <mat-icon class="!text-4xl text-cyan-600">cloud_upload</mat-icon>
                      <div class="text-sm text-gray-600">
                        Glissez-déposez des images ici, ou
                        <label for="file-input" class="text-cyan-700 font-medium cursor-pointer hover:underline">choisissez des fichiers</label>
                      </div>
                      <input id="file-input" type="file" class="hidden" multiple accept="image/*" (change)="onFileInputChange($event)" />
                      <div class="text-xs text-gray-500">Formats: JPG, PNG, WebP. Taille max recommandée 5MB.</div>
                      <div *ngIf="isUploading()" class="text-xs text-emerald-700">Téléversement en cours...</div>
                    </div>
                  </div>

                  <!-- Main image preview -->
                  <div *ngIf="images().length > 0" class="rounded-xl border border-gray-200 overflow-hidden bg-white">
                    <div class="px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-900">Image principale</div>
                    <div class="p-4">
                      <div class="relative aspect-square rounded-lg bg-gray-100 overflow-hidden">
                        <img [src]="images()[0]?.url" [alt]="images()[0]?.name" class="w-full h-full object-cover" />
                        <span class="absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold bg-cyan-600">Principal</span>
                      </div>
                    </div>
                  </div>

                  <!-- Uploaded thumbnails -->
                  <div *ngIf="images().length > 0" class="rounded-xl border border-gray-200 bg-white">
                    <div class="px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-900">Images téléchargées</div>
                    <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div *ngFor="let img of images(); let i = index" class="relative group">
                        <img [src]="img.url" [alt]="img.name" class="w-full h-28 object-cover rounded-lg border border-gray-200" />
                        <!-- Remove -->
                        <button
                          type="button"
                          (click)="removeImage(i)"
                          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                          aria-label="Supprimer l'image"
                        >
                          <mat-icon class="!text-base">close</mat-icon>
                        </button>
                        <!-- Set as main -->
                        <button
                          *ngIf="i !== 0"
                          type="button"
                          (click)="setMainImage(i)"
                          class="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition bg-white/90 hover:bg-white text-cyan-700 rounded-full px-2 py-1 shadow text-xs inline-flex items-center gap-1"
                          aria-label="Définir comme principale"
                        >
                          <mat-icon class="!text-base">star</mat-icon>
                          Principal
                        </button>
                        <!-- Main badge -->
                        <span
                          *ngIf="i === 0"
                          class="absolute bottom-2 left-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full shadow"
                        >
                          Principal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </div>
      </div>
    </section>
    <style>
      /* Utility: clamp text on environments without plugin */
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProductNewPage {
  private readonly produitService = inject(ProduitService);
  private readonly snack = inject(MatSnackBar);
  private readonly http = inject(HttpClient);
  private readonly basePathToken = inject(BASE_PATH, { optional: true }) as string | null;
  private readonly route = inject(ActivatedRoute);

  produitCode = signal<string>('');
  name = signal<string>('');
  price = signal<string>('0');
  stock = signal<string>('0');
  categorie = signal<string>('');
  state = signal<string>('ACTIVE');
  description = signal<string>('');
  isSaving = signal<boolean>(false);

  images = signal<{ id: number; url: string; name: string }[]>([]);
  pendingFiles = signal<File[]>([]);
  isUploading = signal<boolean>(false);
  dragActive = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  originalCode = signal<string>('');

  ngOnInit(): void {
    try {
      this.route.queryParamMap.subscribe((params) => {
        const editCode = params.get('edit');
        if (editCode) {
          this.isEdit.set(true);
          this.originalCode.set(editCode);
          this.loadProduct(editCode);
        } else {
          this.isEdit.set(false);
          if (!this.produitCode()) {
            this.produitCode.set(this.generateProductCode());
          }
        }
      });
    } catch {
      if (!this.produitCode()) {
        this.produitCode.set(this.generateProductCode());
      }
    }
  }

  regenerateCode(): void {
    this.produitCode.set(this.generateProductCode());
  }

  private generateProductCode(): string {
    const now = new Date();
    const pad = (n: number, s: number = 2) => n.toString().padStart(s, '0');
    const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRD-${ts}-${rand}`;
  }

  onFileInputChange(e: Event): void {
    const files = (e.target as HTMLInputElement)?.files;
    if (files && files.length > 0) {
      const arr = Array.from(files);
      const nextPending = [...this.pendingFiles(), ...arr];
      this.pendingFiles.set(nextPending);
      // Add local previews for UX (id=0 indicates local preview)
      const previews = arr.map((file) => ({
        id: 0,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      this.images.set([...this.images(), ...previews]);
      (e.target as HTMLInputElement).value = '';
    }
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.dragActive.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragActive.set(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const arr = Array.from(files);
      const nextPending = [...this.pendingFiles(), ...arr];
      this.pendingFiles.set(nextPending);
      // Previews (id=0) shown until upload completes
      const previews = arr.map((file) => ({
        id: 0,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      this.images.set([...this.images(), ...previews]);
    }
  }

  private uploadFiles(fileList: FileList | File[], onComplete?: () => void): void {
    const files: File[] = Array.isArray(fileList)
      ? (fileList as File[])
      : Array.from(fileList as FileList);
    if (files.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.isUploading.set(true);

    const base = (this.basePathToken ?? this.produitService.configuration.basePath ?? '').replace(
      /\/$/,
      '',
    );
    const url = `${base}/files/upload`;

    let remaining = files.length;

    files.forEach((file: File) => {
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.http.post<any>(url, fd).subscribe({
        next: (res) => {
          const id = Number(res?.id ?? 0);
          const downloadUrl = String(res?.url ?? `${base}/files/download/${id}`);
          const item = {
            id,
            url: downloadUrl,
            name: String(res?.name ?? file.name),
          };
          // Replace matching local preview (id=0 + same name) with server item
          this.images.set([
            ...this.images().filter((it) => !(it.id === 0 && it.name === file.name)),
            item,
          ]);
        },
        error: () => {
          this.snack.open(`❌ Échec du téléversement de ${file.name}`, 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          });
        },
        complete: () => {
          remaining -= 1;
          if (remaining === 0) {
            this.isUploading.set(false);
            // Purge any remaining local previews (id === 0)
            this.images.set(this.images().filter((img) => Number(img.id) > 0));
            // Clear pending queue
            this.pendingFiles.set([]);
            this.snack.open('✅ Téléversement terminé', 'Fermer', {
              duration: 2000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['snack-success'],
            });
            if (onComplete) onComplete();
          }
        },
      });
    });
  }

  removeImage(index: number): void {
    const img = this.images()[index];
    if (!img) return;

    const base = (this.basePathToken ?? this.produitService.configuration.basePath ?? '').replace(
      /\/$/,
      '',
    );
    const url = `${base}/files/${img.id}`;

    this.http.delete(url).subscribe({
      next: () => {
        const nextList = this.images().slice();
        nextList.splice(index, 1);
        this.images.set(nextList);
      },
      error: () => {
        const nextList = this.images().slice();
        nextList.splice(index, 1);
        this.images.set(nextList);
      },
    });
  }

  setMainImage(index: number): void {
    if (index <= 0 || index >= this.images().length) return;
    const list = this.images().slice();
    const [selected] = list.splice(index, 1);
    list.unshift(selected);
    this.images.set(list);
  }

  private loadProduct(code: string): void {
    this.isSaving.set(true);
    try {
      this.produitService.produitGetGet(code).subscribe({
        next: (res: any) => {
          const item = res?.data || res;
          this.produitCode.set(String(item?.produitCode || ''));
          this.name.set(String(item?.nom || ''));
          this.description.set(String(item?.description || ''));
          this.price.set(String(item?.prix ?? '0'));
          this.stock.set(String(item?.stock ?? '0'));
          this.categorie.set(String(item?.categorie || ''));
          this.state.set(String(item?.state || 'ACTIVE'));
          const imgUrl = String(item?.image || '');
          if (imgUrl) {
            this.images.set([{ id: 0, url: imgUrl, name: 'image' }]);
          } else {
            this.images.set([]);
          }
          this.isSaving.set(false);
        },
        error: () => {
          this.isSaving.set(false);
          this.snack.open('❌ Échec du chargement du produit', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          });
        },
      });
    } catch {
      this.isSaving.set(false);
    }
  }

  onSubmit(e: Event): void {
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
      const auto = this.generateProductCode();
      this.produitCode.set(auto);
      data.produitCode = auto;
    }

    if (!data.nom) {
      this.snack.open('⚠️ Veuillez renseigner le nom du produit', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snack-warning'],
      });
      return;
    }

    const finalizeCreate = () => {
      // Attach uploaded images to payload (server IDs only)
      const mainImageUrl = this.images()[0]?.url;
      if (mainImageUrl) {
        (data as any).image = mainImageUrl;
      }

      this.isSaving.set(true);
      try {
        const action$ = this.isEdit()
          ? this.produitService.produitUpdatePut(data as any)
          : this.produitService.produitCreatePost(data as any);
        action$.subscribe({
          next: () => {
            this.isSaving.set(false);
            this.snack.open(
              this.isEdit() ? '✅ Produit mis à jour !' : '✅ Produit créé avec succès !',
              'Fermer',
              {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['snack-success'],
              },
            );
          },
          error: () => {
            this.isSaving.set(false);
            this.snack.open(
              this.isEdit()
                ? '❌ Échec de la mise à jour du produit'
                : '❌ Échec de la création du produit',
              'Réessayer',
              {
                duration: 4000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['snack-error'],
              },
            );
          },
        });
      } catch {
        this.isSaving.set(false);
        this.snack.open(
          this.isEdit()
            ? '❌ Échec de la mise à jour du produit'
            : '❌ Échec de la création du produit',
          'Réessayer',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          },
        );
      }
    };

    const pending = this.pendingFiles();
    if (pending && pending.length > 0) {
      // Upload images via FormData automatically before saving the product
      this.uploadFiles(pending, () => finalizeCreate());
    } else {
      finalizeCreate();
    }
  }
}
