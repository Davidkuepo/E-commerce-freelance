import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';

import { ProduitService } from '../../api/api/produit.service';
import { CartService } from '../../api/api/cart.service';
import { Product } from '../../api';
import { ButtonWrapper, BaseImage } from '../../components/form/wrappers';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const adaptProduitToProduct = (d: any): Product => {
  let images: string[] = [];
  if (Array.isArray(d?.images)) {
    images = d.images;
  } else if (typeof d?.image === 'string' && d.image.trim()) {
    images = [d.image.trim()];
  }

  return {
    id: d?.produitCode,
    name: d?.nom,
    description: d?.description ?? '',
    price: Number(d?.prix ?? 0),
    currency: 'XAF',
    quantity: Number(d?.stock ?? 0),
    sold_out: Number(d?.stock ?? 0) <= 0,
    state_product: d?.state ?? undefined,
    images: images,
  } as any;
};

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonWrapper,
    BaseImage,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px)] bg-gray-50">
      <div class="container mx-auto max-w-7xl px-6 py-10">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-4 text-gray-600">
          <a routerLink="/" class="hover:text-cyan-700 flex items-center gap-1">
            <mat-icon class="!text-base">home</mat-icon>
            Accueil
          </a>
          <mat-icon class="!text-base text-gray-400">chevron_right</mat-icon>
          <a routerLink="/products" class="hover:text-cyan-700">Produits</a>
          <mat-icon class="!text-base text-gray-400">chevron_right</mat-icon>
          <span class="text-gray-900 font-medium line-clamp-1">{{
            product()?.name || 'Détail produit'
          }}</span>
        </nav>

        <!-- Loader -->
        <div *ngIf="loading()" class="flex items-center justify-center py-12">
          <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
        </div>

        <!-- Content -->
        <div
          *ngIf="!loading() && product()"
          class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <!-- Image column -->
            <div class="p-4 md:p-6 border-r border-gray-100 md:border-0">
              <div class="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <app-base-image
                  [src]="product()?.images?.[0] || placeholder"
                  [alt]="product()?.name || 'Product image'"
                  [height]="540"
                  [cover]="true"
                  [rounded]="false"
                />
              </div>

              <!-- Thumbnails -->
              <div *ngIf="(product()?.images || []).length > 1" class="mt-3 grid grid-cols-4 gap-2">
                <img
                  *ngFor="let img of product()?.images; let i = index"
                  [src]="img"
                  [alt]="product()?.name + ' ' + i"
                  class="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <!-- Info column -->
            <div class="p-6 md:p-10 space-y-5">
              <div class="flex items-start justify-between gap-3">
                <h1 class="text-3xl md:text-4xl font-semibold text-gray-900">
                  {{ product()?.name }}
                </h1>
              </div>

              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100"
                >
                  <mat-icon class="!text-base">qr_code_2</mat-icon>
                  {{ product()?.id }}
                </span>
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  *ngIf="($any(product())?.quantity || 0) > 0; else outOfStock"
                >
                  <mat-icon class="!text-base">inventory_2</mat-icon>
                  En stock ({{ $any(product())?.quantity || 0 }})
                </span>
                <ng-template #outOfStock>
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100"
                  >
                    <mat-icon class="!text-base">do_not_disturb</mat-icon>
                    Indisponible
                  </span>
                </ng-template>
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                >
                  <mat-icon class="!text-base">toggle_on</mat-icon>
                  {{ $any(product())?.state_product || '—' }}
                </span>
              </div>

              <div class="text-cyan-700 text-4xl md:text-5xl font-extrabold">
                {{ product()?.price | number: '1.0-2' }} {{ product()?.currency || 'XAF' }}
              </div>

              <div class="flex items-center gap-2 text-gray-600">
                <mat-icon class="!text-base text-amber-500">star</mat-icon>
                <span>{{ $any(product())?.rating || 0 }}</span>
              </div>

              <p class="text-gray-700 leading-relaxed">
                {{ product()?.description || 'Aucune description disponible' }}
              </p>

              <div class="flex items-center gap-4">
                <app-button color="primary" (clicked)="addToCart()" icon="add_shopping_cart"
                  >Ajouter au panier</app-button
                >
                <a
                  routerLink="/cart"
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <mat-icon class="!text-base">shopping_cart</mat-icon>
                  Voir le panier
                </a>
                <a
                  routerLink="/products"
                  class="text-cyan-700 font-medium hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon>
                  Retour aux produits
                </a>
              </div>

              <!-- Meta info -->
              <div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">Code</span>
                    <span class="font-medium text-gray-900">{{ product()?.id }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">Catégorie</span>
                    <span class="font-medium text-gray-900">{{
                      $any(product())?.categorie || '—'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">Stock</span>
                    <span class="font-medium text-gray-900">{{
                      $any(product())?.quantity || 0
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">État</span>
                    <span class="font-medium text-gray-900">{{
                      $any(product())?.state_product || '—'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading() && !product()" class="text-center text-gray-600 py-16">
          Produit introuvable.
          <a routerLink="/products" class="text-cyan-700 font-medium hover:underline ml-1"
            >Voir les produits</a
          >
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly produitService = inject(ProduitService);
  private readonly cartService = inject(CartService);
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  product = signal<Product | null>(null);
  loading = signal<boolean>(false);
  placeholder = 'https://via.placeholder.com/640x480?text=Product';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id');
      if (!code) return;
      this.loading.set(true);
      this.produitService.produitGetGet(code).subscribe({
        next: (resp: any) => {
          const d = resp?.data;
          this.product.set(d ? adaptProduitToProduct(d) : null);
          this.loading.set(false);
        },
        error: () => {
          this.product.set(null);
          this.loading.set(false);
        },
      });
    });
  }

  addToCart() {
    const p = this.product();
    if (!p?.id) return;

    const clientCode = (() => {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
        const u = raw ? JSON.parse(raw) : null;
        return u?.id || u?.email || 'guest';
      } catch {
        return 'guest';
      }
    })();

    const produitCode = p.id as string;

    // Guest fallback: maintain local storage cart when not authenticated
    if (clientCode === 'guest') {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('guestCart') : null;
        const cart = raw ? JSON.parse(raw) : { items: [], total: 0, currency: 'XAF' };

        const items = Array.isArray(cart.items) ? cart.items : [];
        const existingIdx = items.findIndex(
          (it: any) =>
            String(it?.itemId || it?.product?.id || it?.product?.produitCode) === produitCode,
        );

        if (existingIdx >= 0) {
          const currentQty = Number(items[existingIdx].quantity || 1);
          items[existingIdx].quantity = currentQty + 1;
          items[existingIdx].subtotal =
            Number(items[existingIdx].product?.price || 0) * items[existingIdx].quantity;
        } else {
          items.push({
            itemId: produitCode,
            product: {
              id: produitCode,
              name: (p as any)?.name,
              price: Number((p as any)?.price || 0),
              currency: (p as any)?.currency || 'XAF',
              image: (p as any)?.images?.[0] || (p as any)?.image || '',
            },
            quantity: 1,
            subtotal: Number((p as any)?.price || 0),
          });
        }

        cart.items = items;
        cart.total = items.reduce(
          (sum: number, it: any) => sum + Number(it.product?.price || 0) * Number(it.quantity || 1),
          0,
        );
        cart.currency = cart.currency || 'XAF';

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('guestCart', JSON.stringify(cart));
        }
        this.snack.open('Ajouté au panier', undefined, { duration: 2000 });
      } catch {
        this.snack.open('Échec ajout au panier', undefined, { duration: 2500 });
      }
      return;
    }

    // Authenticated flow: use Panier API
    this.store.dispatch(PanierActions.addProduct({ panierCode: '', produitCode, quantite: 1 }));
  }
}
