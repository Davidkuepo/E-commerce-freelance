import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonWrapper } from '../../components/form/wrappers';
import { CartService } from '../../api/api/cart.service';
import { DeleteModalComponent } from '../../components/modal/delete-modal.component';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';
import { PanierService } from '../../api/api/panier.service';
import { ApiResponsePanier } from '../../api/model/ApiResponsePanier';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonWrapper,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DeleteModalComponent,
  ],
  template: `
    <section class="container mx-auto py-10 max-w-5xl space-y-6">
      <h2 class="text-2xl font-semibold">Votre Panier</h2>

      <div *ngIf="loading()" class="flex items-center justify-center">
        <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
      </div>

      <div *ngIf="!loading() && (items() || []).length === 0" class="text-gray-600">
        Votre panier est vide.
        <a routerLink="/" class="text-cyan-700 font-medium hover:underline ml-1"
          >Continuer vos achats</a
        >
      </div>

      <div class="space-y-6" *ngIf="!loading() && (items() || []).length > 0">
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="divide-y divide-gray-100">
            <div
              *ngFor="let item of items()"
              class="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <img
                  [src]="
                    item.product?.images?.[0] ||
                    item.product?.image ||
                    'https://via.placeholder.com/64x64?text=Img'
                  "
                  alt=""
                  class="w-16 h-16 object-cover rounded border border-gray-200"
                />
                <div>
                  <div class="font-medium line-clamp-1">{{ item.product?.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ item.product?.price | number: '1.0-2' }}
                    {{ item.product?.currency || 'USD' }}
                  </div>
                </div>
              </div>

              <div class="sm:justify-self-end">
                <div
                  class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1"
                >
                  <button
                    class="p-1 rounded hover:bg-gray-100"
                    (click)="updateQuantity(item.itemId, (item.quantity || 1) - 1)"
                    [disabled]="(item.quantity || 1) <= 1 || updatingItem() === item.itemId"
                    aria-label="Diminuer"
                  >
                    <mat-icon class="!text-base">remove</mat-icon>
                  </button>
                  <span class="min-w-6 text-center font-medium">{{ item.quantity || 1 }}</span>
                  <button
                    class="p-1 rounded hover:bg-gray-100"
                    (click)="updateQuantity(item.itemId, (item.quantity || 1) + 1)"
                    [disabled]="updatingItem() === item.itemId"
                    aria-label="Augmenter"
                  >
                    <mat-icon class="!text-base">add</mat-icon>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 sm:justify-self-end">
                <div class="text-right">
                  <div class="text-sm text-gray-500">Sous-total</div>
                  <div class="text-base font-semibold">
                    {{ (item.product?.price || 0) * item.quantity | number: '1.0-2' }}
                    {{ item.product?.currency || 'USD' }}
                  </div>
                </div>
                <button
                  type="button"
                  class="p-2 rounded-md border border-gray-200 hover:bg-red-50 text-red-600"
                  (click)="openDelete(item.itemId, item.product?.name)"
                  [disabled]="removingItem() === item.itemId"
                  title="Supprimer"
                >
                  <mat-icon class="!text-base">delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Total</span>
              <span class="text-lg font-semibold"
                >{{ total() | number: '1.0-2' }} {{ currency() }}</span
              >
            </div>
          </div>
          <div class="flex items-center justify-end">
            <app-button
              color="primary"
              (clicked)="checkout()"
              icon="shopping_cart_checkout"
              [disabled]="checkoutLoading()"
            >
              <ng-container *ngIf="!checkoutLoading(); else loadingCheckout"
                >Valider la commande</ng-container
              >
              <ng-template #loadingCheckout>
                <mat-progress-spinner diameter="18" mode="indeterminate"></mat-progress-spinner>
              </ng-template>
            </app-button>
          </div>
        </div>

        <!-- Delete confirmation modal -->
        <app-delete-modal
          [open]="modalOpen()"
          [title]="'Retirer l\\'article'"
          [message]="'Confirmez la suppression : ' + (selectedItemName() || '')"
          (confirm)="confirmDelete()"
          (cancel)="cancelDelete()"
        ></app-delete-modal>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  private readonly cartService = inject(CartService);
  private readonly snack = inject(MatSnackBar);
  private readonly panierService = inject(PanierService);

  loading = signal<boolean>(false);
  items = signal<any[]>([]);
  total = signal<number>(0);
  currency = signal<string>('USD');
  isGuest = signal<boolean>(false);
  panierCode = signal<string | null>(null);
  // action loaders
  updatingItem = signal<string | null>(null);
  removingItem = signal<string | null>(null);
  checkoutLoading = signal<boolean>(false);
  selectedItemId = signal<string>('');
  selectedItemName = signal<string>('');
  modalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);

    const rawClient = localStorage.getItem('user');
    const clientData = rawClient ? JSON.parse(rawClient) : null;
    const clientCode = clientData ? clientData.id : null;

    if (clientCode) {
      this.panierService.panierByClientGet(clientCode).subscribe({
        next: (response: ApiResponsePanier) => {
          let mapped: any[] = [];
          if (response.status === 'SUCCESS' && response.data) {
            const panier = response.data;
            this.panierCode.set(panier.panierCode || null);
            mapped = Array.isArray(panier.produits)
              ? panier.produits.map((p: any) => ({
                  itemId: p.produitCode ?? p.produit?.code ?? String(p.produitCode ?? ''),
                  quantity: p.quantite ?? p.quantity ?? 1,
                  product: {
                    name: p.nom ?? p.produit?.name ?? '',
                    price: p.prix ?? p.produit?.price ?? 0,
                    currency: 'XAF',
                    image: p.image ?? p.produit?.image,
                    images: p.images ?? p.produit?.images ?? [],
                  },
                }))
              : [];
            this.items.set(mapped);
            const total = mapped.reduce(
              (sum: number, it: any) => sum + (it.product?.price || 0) * (it.quantity || 1),
              0,
            );
            this.total.set(total || 0);
            this.currency.set('XAF');
          } else {
            this.items.set([]);
            this.total.set(0);
            this.currency.set('XAF');
          }
          this.loading.set(false);
        },
        error: () => {
          this.handleGuestCart();
          this.loading.set(false);
        },
      });
    } else {
      this.handleGuestCart();
      // ensure we stop the global loading when there is no logged user
      this.loading.set(false);
    }
  }

  private handleGuestCart() {
    try {
      const raw = localStorage.getItem('guestCart');
      const cart = raw ? JSON.parse(raw) : { items: [], total: 0, currency: 'USD' };
      this.items.set(cart.items || []);
      this.total.set(cart.total || 0);
      this.currency.set(cart.currency || 'USD');
      this.isGuest.set(true);
    } catch {
      this.items.set([]);
      this.total.set(0);
      this.currency.set('USD');
      this.isGuest.set(true);
    }
    // safety: ensure loading indicator is removed after handling guest cart
    this.loading.set(false);
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    if (this.isGuest()) {
      try {
        const raw = localStorage.getItem('guestCart');
        const cart = raw ? JSON.parse(raw) : { items: [], total: 0, currency: 'USD' };
        const idx = cart.items.findIndex((it: any) => it.itemId === itemId);
        if (idx >= 0) {
          cart.items[idx].quantity = quantity;
        }
        cart.total = cart.items.reduce(
          (sum: number, it: any) => sum + (it.product?.price || 0) * it.quantity,
          0,
        );
        localStorage.setItem('guestCart', JSON.stringify(cart));
        this.items.set(cart.items);
        this.total.set(cart.total);
        this.currency.set(cart.currency || 'USD');
        this.snack.open('Quantité mise à jour', undefined, { duration: 2000 });
      } catch {
        this.snack.open('Erreur de mise à jour', undefined, { duration: 2500 });
      }
      return;
    }
    // pour les utilisateurs connectés, utiliser l'API panier
    const code = this.panierCode();
    if (!code) {
      this.snack.open('Impossible de trouver le panier', undefined, { duration: 2500 });
      return;
    }

    // itemId est le produitCode dans le mapping ci-dessus
    this.updatingItem.set(itemId);
    this.panierService.panierAddProductPost(code, itemId, quantity).subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Quantité mise à jour', undefined, { duration: 2000 });
      },
      error: () => this.snack.open('Erreur de mise à jour', undefined, { duration: 2500 }),
      complete: () => this.updatingItem.set(null),
    });
  }

  removeItem(itemId: string) {
    if (this.isGuest()) {
      try {
        const raw = localStorage.getItem('guestCart');
        const cart = raw ? JSON.parse(raw) : { items: [], total: 0, currency: 'USD' };
        cart.items = (cart.items || []).filter((it: any) => it.itemId !== itemId);
        cart.total = cart.items.reduce(
          (sum: number, it: any) => sum + (it.product?.price || 0) * it.quantity,
          0,
        );
        localStorage.setItem('guestCart', JSON.stringify(cart));
        this.items.set(cart.items);
        this.total.set(cart.total);
        this.currency.set(cart.currency || 'USD');
        this.snack.open('Article retiré', undefined, { duration: 2000 });
      } catch {
        this.snack.open('Erreur lors de la suppression', undefined, { duration: 2500 });
      }
      return;
    }
    const code = this.panierCode();
    if (!code) {
      this.snack.open('Impossible de trouver le panier', undefined, { duration: 2500 });
      return;
    }

    // itemId est le produitCode dans notre mapping
    this.removingItem.set(itemId);
    this.panierService.panierRemoveProductDelete(code, itemId).subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Article retiré', undefined, { duration: 2000 });
      },
      error: () => this.snack.open('Erreur lors de la suppression', undefined, { duration: 2500 }),
      complete: () => this.removingItem.set(null),
    });
  }

  checkout() {
    if (this.isGuest()) {
      try {
        localStorage.removeItem('guestCart');
        this.items.set([]);
        this.total.set(0);
        this.currency.set('USD');
        this.snack.open('Commande validée (invité)', undefined, { duration: 2500 });
      } catch {
        this.snack.open('Échec du paiement', undefined, { duration: 3000 });
      }
      return;
    }
    const code = this.panierCode();
    if (!code) {
      this.snack.open('Impossible de trouver le panier', undefined, { duration: 2500 });
      return;
    }

    // Si le backend n'a pas d'endpoint "checkout" pour panier, on vide le panier et affiche la confirmation.
    this.checkoutLoading.set(true);
    this.panierService.panierClearDelete(code).subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Commande validée', undefined, { duration: 2500 });
      },
      error: () => this.snack.open('Échec du paiement', undefined, { duration: 3000 }),
      complete: () => this.checkoutLoading.set(false),
    });
  }

  openDelete(itemId: string, name?: string) {
    if (!itemId) return;
    this.selectedItemId.set(itemId);
    this.selectedItemName.set(String(name || ''));
    this.modalOpen.set(true);
  }

  confirmDelete() {
    const id = this.selectedItemId();
    if (id) {
      this.removeItem(id);
    }
    this.modalOpen.set(false);
    this.selectedItemId.set('');
    this.selectedItemName.set('');
  }

  cancelDelete() {
    this.modalOpen.set(false);
    this.selectedItemId.set('');
    this.selectedItemName.set('');
  }
}
