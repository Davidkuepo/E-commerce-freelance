import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';

import { ProduitService } from '../../api/api/produit.service';
import { CartService } from '../../api/api/cart.service';
import { Product } from '../../api';
import { ProductCartItemComponent } from '../../components/product/product-cart-item.component';
import { ProductListItemComponent } from '../../components/product/product-list-item.component';
import { TextInputWrapper, ButtonWrapper, CheckboxWrapper } from '../../components/form/wrappers';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const adaptProduitToProduct = (d: any): Product => {
  const img = typeof d?.image === 'string' ? d.image.trim() : '';
  return {
    id: d?.produitCode,
    name: d?.nom,
    description: d?.description ?? '',
    price: Number(d?.prix ?? 0),
    currency: 'XAF',
    quantity: Number(d?.stock ?? 0),
    sold_out: Number(d?.stock ?? 0) <= 0,
    state_product: d?.state ?? undefined,
    images: img ? [img] : [],
  } as any;
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCartItemComponent,
    ProductListItemComponent,
    TextInputWrapper,
    ButtonWrapper,
    CheckboxWrapper,
    MatSnackBarModule,
  ],
  template: `
    <section class="container mx-auto py-10 space-y-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">Tous les produits</h2>
        <div class="flex items-center gap-2">
          <div class="w-64">
            <app-text-input
              [placeholder]="'Rechercher...'"
              [value]="query()"
              (valueChange)="query.set($event)"
            ></app-text-input>
          </div>
          <app-button color="primary" (clicked)="search()">Rechercher</app-button>

          <div
            class="ml-2 hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1"
          >
            <button
              class="p-2 rounded-md"
              [class.bg-gray-200]="viewMode() === 'card'"
              title="Vue Carte"
              (click)="toggleView('card')"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
              </svg>
            </button>
            <button
              class="p-2 rounded-md"
              [class.bg-gray-200]="viewMode() === 'list'"
              title="Vue Liste"
              (click)="toggleView('list')"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside class="md:col-span-3">
          <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="font-semibold">Filtres</div>
              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                  (click)="resetFilters()"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <app-text-input
                label="Prix min"
                [type]="'number'"
                [value]="minPrice() + ''"
                (valueChange)="minPrice.set(+$event || 0)"
              ></app-text-input>

              <app-text-input
                label="Prix max"
                [type]="'number'"
                [value]="maxPrice() + ''"
                (valueChange)="maxPrice.set(+$event || 0)"
              ></app-text-input>

              <app-text-input
                label="Note minimale"
                [type]="'number'"
                [hint]="'Entrez une valeur entre 0 et 5'"
                [value]="minRating() + ''"
                (valueChange)="minRating.set(+$event || 0)"
              ></app-text-input>

              <app-checkbox
                label="En stock seulement"
                [checked]="inStockOnly()"
                (checkedChange)="inStockOnly.set($event)"
              ></app-checkbox>

              <div class="pt-1">
                <app-button color="primary" [fullWidth]="true" (clicked)="search()"
                  >Appliquer les filtres</app-button
                >
              </div>
            </div>
          </div>
        </aside>

        <div class="md:col-span-9">
          <div class="flex items-center justify-center" *ngIf="loading()">
            <span class="loading loading-spinner loading-md text-primary"></span>
          </div>

          <ng-container *ngIf="!loading()">
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
              *ngIf="viewMode() === 'list'; else cardGridProducts"
            >
              <app-product-list-item
                *ngFor="let p of filteredProducts()"
                [product]="p"
                (addToCart)="addToCart($event)"
              />
            </div>
            <ng-template #cardGridProducts>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <app-product-cart-item
                  *ngFor="let p of filteredProducts()"
                  [product]="p"
                  (addToCart)="addToCart($event)"
                />
              </div>
            </ng-template>

            <div class="text-center text-gray-500 mt-4" *ngIf="filteredProducts().length === 0">
              Aucun produit trouvé.
            </div>
          </ng-container>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  private readonly produitService = inject(ProduitService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  query = signal<string>('');
  viewMode = signal<'card' | 'list'>('card');

  minPrice = signal<number>(0);
  maxPrice = signal<number>(0);
  minRating = signal<number>(0);
  inStockOnly = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') || '';
      const viewParam = (params.get('view') || '').toLowerCase();
      this.viewMode.set(viewParam === 'list' ? 'list' : 'card');
      this.query.set(q);
      this.fetchProducts(q || undefined);
    });
  }

  search() {
    this.fetchProducts(this.query());
  }

  toggleView(mode: 'card' | 'list') {
    this.viewMode.set(mode);
    try {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { view: mode },
        queryParamsHandling: 'merge',
      });
    } catch {}
  }

  onMinPrice(e: Event) {
    const v = Number((e.target as HTMLInputElement)?.value ?? 0);
    this.minPrice.set(isNaN(v) ? 0 : v);
  }
  onMaxPrice(e: Event) {
    const v = Number((e.target as HTMLInputElement)?.value ?? 0);
    this.maxPrice.set(isNaN(v) ? 0 : v);
  }
  onMinRating(e: Event) {
    const v = Number((e.target as HTMLInputElement)?.value ?? 0);
    this.minRating.set(isNaN(v) ? 0 : v);
  }
  resetFilters() {
    this.minPrice.set(0);
    this.maxPrice.set(0);
    this.minRating.set(0);
    this.inStockOnly.set(false);
  }

  filteredProducts(): Product[] {
    const items = this.products() || [];
    const minP = this.minPrice() || 0;
    const maxP = this.maxPrice() || 0;
    const minR = this.minRating() || 0;
    const inStock = this.inStockOnly();

    return items.filter((p: any) => {
      const price = Number(p?.price ?? 0);
      const rating = Number(p?.rating ?? 0);
      const qty = Number(p?.quantity ?? 0);
      const soldOut = Boolean(p?.sold_out);

      if (minP > 0 && price < minP) return false;
      if (maxP > 0 && price > maxP) return false;
      if (minR > 0 && rating < minR) return false;
      if (inStock && (soldOut || qty <= 0)) return false;
      return true;
    });
  }

  fetchProducts(q?: string) {
    this.loading.set(true);
    this.produitService.produitAllGet().subscribe({
      next: (resp: any) => {
        const raw = resp?.data || [];
        const mapped = raw
          .map(adaptProduitToProduct)
          .filter((p: any) => p.state_product === 'ACTIVE');
        const qv = (q || '').toLowerCase();
        const filtered = qv
          ? mapped.filter((it: any) =>
              String(it?.name || '')
                .toLowerCase()
                .includes(qv),
            )
          : mapped;
        this.products.set(filtered);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addToCart(product: Product) {
    const clientCode = (() => {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
        const u = raw ? JSON.parse(raw) : null;
        return u?.id || u?.email || 'guest';
      } catch {
        return 'guest';
      }
    })();

    const produitCode = product.id as string;

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
              name: (product as any)?.name,
              price: Number((product as any)?.price || 0),
              currency: (product as any)?.currency || 'XAF',
              image: (product as any)?.images?.[0] || (product as any)?.image || '',
            },
            quantity: 1,
            subtotal: Number((product as any)?.price || 0),
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

    const cart = typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;

    let panierCode = null;

    if (cart) {
      try {
        const cartData = JSON.parse(cart);
        panierCode = cartData.data.panierCode;
      } catch (error) {
        console.error('Erreur lors du parsing du cart:', error);
      }
    }
    console.log(panierCode);

    this.store.dispatch(
      PanierActions.addProduct({ panierCode: panierCode, produitCode, quantite: 1 }),
    );
  }
}
