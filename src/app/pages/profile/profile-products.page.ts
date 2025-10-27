import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProduitService } from '../../api/api/produit.service';
import { Produit } from '../../api/model/produit';
import { DeleteModalComponent } from '../../components/modal/delete-modal.component';

@Component({
  selector: 'app-profile-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatSnackBarModule, DeleteModalComponent],
  template: `
    <section class="container mx-auto py-6 space-y-4">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <!-- Header row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <mat-icon class="!text-base text-cyan-600">inventory_2</mat-icon>
            <h2 class="text-2xl font-semibold">Gestion des produits</h2>
          </div>
          <a
            routerLink="/profile/products/new"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
          >
            <mat-icon class="!text-base">add_box</mat-icon>
            Nouveau produit
          </a>
        </div>

        <!-- Table/list -->
        <div class="mt-6">
          <!-- Loading -->
          <div *ngIf="loading()" class="flex items-center justify-center py-10">
            <span class="loading loading-spinner loading-md text-primary"></span>
          </div>

          <!-- Empty -->
          <div *ngIf="!loading() && items().length === 0" class="text-center text-gray-500 py-10">
            Aucun produit pour le moment.
          </div>

          <!-- Table -->
          <div *ngIf="!loading() && items().length > 0" class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-50">
                <tr class="text-left text-sm text-gray-600">
                  <th class="px-4 py-3">Image</th>
                  <th class="px-4 py-3">Code</th>
                  <th class="px-4 py-3">Nom</th>
                  <th class="px-4 py-3">Catégorie</th>
                  <th class="px-4 py-3">Prix</th>
                  <th class="px-4 py-3">Stock</th>
                  <th class="px-4 py-3">État</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr *ngFor="let it of items()" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <img
                      [src]="it.image || 'https://via.placeholder.com/64x64?text=Img'"
                      alt=""
                      class="w-12 h-12 object-cover rounded border border-gray-200"
                    />
                  </td>
                  <td class="px-4 py-3 font-mono text-sm text-gray-700">
                    {{ it.produitCode }}
                  </td>
                  <td class="px-4 py-3">
                    {{ it.nom }}
                  </td>
                  <td class="px-4 py-3">
                    {{ it.categorie || '-' }}
                  </td>
                  <td class="px-4 py-3">{{ it.prix | number: '1.2-2' }} €</td>
                  <td class="px-4 py-3">
                    {{ it.stock ?? 0 }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      [class]="
                        (it.state || 'INACTIVE') === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'
                      "
                    >
                      {{ it.state || 'INACTIVE' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-2">
                      <!-- View -->
                      <a
                        [routerLink]="['/product', it.produitCode]"
                        class="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
                        title="Voir le détail"
                      >
                        <mat-icon class="!text-base">visibility</mat-icon>
                      </a>
                      <!-- Edit -->
                      <a
                        [routerLink]="['/profile/products/new']"
                        [queryParams]="{ edit: it.produitCode }"
                        class="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
                        title="Modifier"
                      >
                        <mat-icon class="!text-base">edit</mat-icon>
                      </a>
                      <!-- Delete -->
                      <button
                        type="button"
                        (click)="openDelete(it.produitCode)"
                        class="p-2 rounded-md border border-gray-200 hover:bg-red-50 text-red-600"
                        title="Supprimer"
                      >
                        <mat-icon class="!text-base">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <app-delete-modal
        [open]="modalOpen()"
        [title]="'Supprimer le produit'"
        [message]="
          'Cette action est irréversible. Confirmez la suppression du produit ' +
          (confirmCode() || '') +
          '.'
        "
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()"
      ></app-delete-modal>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProductsPage {
  private readonly produitService = inject(ProduitService);
  private readonly snack = inject(MatSnackBar);

  items = signal<Produit[]>([]);
  loading = signal<boolean>(false);
  confirmCode = signal<string>('');
  modalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.produitService.produitAllGet().subscribe({
      next: (resp: any) => {
        const list: Produit[] = resp?.data ?? [];
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('❌ Échec du chargement des produits', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
      },
    });
  }

  openDelete(code: string): void {
    if (!code) return;
    this.confirmCode.set(code);
    this.modalOpen.set(true);
  }

  confirmDelete(): void {
    const code = this.confirmCode();
    if (!code) {
      this.modalOpen.set(false);
      return;
    }

    this.produitService.produitDeleteDelete(code).subscribe({
      next: () => {
        this.items.set(this.items().filter((p) => p.produitCode !== code));
        this.modalOpen.set(false);
        this.confirmCode.set('');
        this.snack.open('✅ Produit supprimé', 'Fermer', {
          duration: 2500,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snack-success'],
        });
      },
      error: () => {
        this.modalOpen.set(false);
        this.snack.open('❌ Suppression impossible', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
      },
    });
  }

  cancelDelete(): void {
    this.modalOpen.set(false);
    this.confirmCode.set('');
  }
}
