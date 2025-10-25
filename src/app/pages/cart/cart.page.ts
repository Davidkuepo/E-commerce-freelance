import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonWrapper } from '../../components/form/wrappers';
import { CartService } from '../../api/api/cart.service';

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
  ],
  template: `
    <section class="container mx-auto py-8 max-w-3xl space-y-4">
      <h2 class="text-2xl font-semibold">Votre Panier</h2>

      <div *ngIf="loading()" class="flex items-center justify-center">
        <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
      </div>

      <div *ngIf="!loading() && items().length === 0" class="text-gray-600">
        Votre panier est vide.
        <a routerLink="/" class="text-cyan-700 font-medium hover:underline ml-1"
          >Continuer vos achats</a
        >
      </div>

      <div class="space-y-3" *ngIf="!loading() && items().length > 0">
        <div
          *ngFor="let item of items()"
          class="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-white"
        >
          <div>
            <div class="font-medium">{{ item.product?.name }}</div>
            <div class="text-sm text-gray-600">
              {{ item.product?.price | number: '1.0-2' }} {{ item.product?.currency || 'USD' }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-2 py-1 border rounded"
              (click)="updateQuantity(item.itemId, item.quantity - 1)"
              [disabled]="item.quantity <= 1"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button
              class="px-2 py-1 border rounded"
              (click)="updateQuantity(item.itemId, item.quantity + 1)"
            >
              +
            </button>
            <button class="px-3 py-1 border rounded text-red-600" (click)="removeItem(item.itemId)">
              Retirer
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between border-t pt-3">
          <div class="text-lg font-semibold">Total</div>
          <div class="text-lg font-semibold">{{ total() | number: '1.0-2' }} {{ currency() }}</div>
        </div>

        <div class="flex justify-end">
          <app-button color="primary" (clicked)="checkout()">Valider la commande</app-button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  private readonly cartService = inject(CartService);
  private readonly snack = inject(MatSnackBar);

  loading = signal<boolean>(false);
  items = signal<any[]>([]);
  total = signal<number>(0);
  currency = signal<string>('USD');
  isGuest = signal<boolean>(false);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);
    this.cartService.cartGet().subscribe({
      next: (cart) => {
        this.items.set(cart.items || []);
        this.total.set(cart.total || 0);
        this.currency.set(cart.currency || 'USD');
        this.loading.set(false);
      },
      error: () => {
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
        this.loading.set(false);
      },
    });
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
    this.cartService.cartItemsItemIdPatch(itemId, { quantity }).subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Quantité mise à jour', undefined, { duration: 2000 });
      },
      error: () => this.snack.open('Erreur de mise à jour', undefined, { duration: 2500 }),
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
    this.cartService.cartItemsItemIdDelete(itemId).subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Article retiré', undefined, { duration: 2000 });
      },
      error: () => this.snack.open('Erreur lors de la suppression', undefined, { duration: 2500 }),
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
    this.cartService.cartCheckoutPost().subscribe({
      next: () => {
        this.loadCart();
        this.snack.open('Commande validée', undefined, { duration: 2500 });
      },
      error: () => this.snack.open('Échec du paiement', undefined, { duration: 3000 }),
    });
  }
}
