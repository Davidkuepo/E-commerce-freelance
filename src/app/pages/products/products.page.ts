import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';

import { ProduitService } from '../../api/api/produit.service';
import { CartService } from '../../api/api/cart.service';
import { Product } from '../../api';
import { ProductCard } from '../../components/layout/components';
import { ProductCartItemComponent } from '../../components/product/product-cart-item.component';
import { ProductListItemComponent } from '../../components/product/product-list-item.component';
import { TextInputWrapper, ButtonWrapper, CheckboxWrapper } from '../../components/form/wrappers';

const adaptProduitToProduct = (d: any): Product =>
  ({
    id: d?.produitCode,
    name: d?.nom,
    description: d?.description ?? '',
    price: Number(d?.prix ?? 0),
    currency: 'EUR',
    quantity: Number(d?.stock ?? 0),
    sold_out: Number(d?.stock ?? 0) <= 0,
    state_product: d?.state ?? undefined,
    images: [],
  }) as any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCartItemComponent,
    ProductListItemComponent,
    ProductCard,
    TextInputWrapper,
    ButtonWrapper,
    CheckboxWrapper,
  ],
  template: `
    <section class="container mx-auto py-6 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Tous les produits</h2>
        <div class="flex items-center gap-2">
          <div class="w-64">
            <app-text-input
              label="Rechercher"
              [placeholder]="'Rechercher...'"
              [value]="query()"
              (valueChange)="query.set($event)"
            ></app-text-input>
          </div>
          <app-button color="primary" (clicked)="search()">Rechercher</app-button>

          <!-- View toggle icons -->
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

      <!-- Filters -->
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

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <app-text-input
              label="Prix min"
              [type]="'number'"
              [value]="minPrice() + ''"
              (valueChange)="minPrice.set(+$event || 0)"
            ></app-text-input>
          </div>
          <div>
            <app-text-input
              label="Prix max"
              [type]="'number'"
              [value]="maxPrice() + ''"
              (valueChange)="maxPrice.set(+$event || 0)"
            ></app-text-input>
          </div>
          <div>
            <app-text-input
              label="Note minimale"
              [type]="'number'"
              [hint]="'Entrez une valeur entre 0 et 5'"
              [value]="minRating() + ''"
              (valueChange)="minRating.set(+$event || 0)"
            ></app-text-input>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Etat</label>
            <select
              class="w-full rounded-md border border-gray-200 px-3 py-2"
              [value]="stateFilter()"
              (change)="onStateChange($event)"
            >
              <option value="all">Tous</option>
              <option *ngFor="let s of states()" [value]="s">{{ s }}</option>
            </select>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-3">
          <app-checkbox
            label="En stock seulement"
            [checked]="inStockOnly()"
            (checkedChange)="inStockOnly.set($event)"
          ></app-checkbox>
        </div>
      </div>

      <div class="flex items-center justify-center" *ngIf="loading()">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>

      <ng-container *ngIf="!loading()">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
      </ng-container>

      <div class="text-center text-gray-500" *ngIf="!loading() && filteredProducts().length === 0">
        Aucun produit trouvé.
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

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  query = signal<string>('');
  viewMode = signal<'card' | 'list'>('card');

  minPrice = signal<number>(0);
  maxPrice = signal<number>(0);
  minRating = signal<number>(0);
  inStockOnly = signal<boolean>(false);
  stateFilter = signal<string>('all');

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
  onStateChange(e: Event) {
    const v = (e.target as HTMLSelectElement)?.value ?? 'all';
    this.stateFilter.set(v || 'all');
  }
  resetFilters() {
    this.minPrice.set(0);
    this.maxPrice.set(0);
    this.minRating.set(0);
    this.inStockOnly.set(false);
    this.stateFilter.set('all');
  }

  states(): string[] {
    const set = new Set<string>();
    for (const p of this.products()) {
      const s = (p as any)?.state_product;
      if (s) set.add(String(s));
    }
    return Array.from(set);
  }

  filteredProducts(): Product[] {
    const items = this.products() || [];
    const minP = this.minPrice() || 0;
    const maxP = this.maxPrice() || 0;
    const minR = this.minRating() || 0;
    const inStock = this.inStockOnly();
    const state = this.stateFilter();

    return items.filter((p: any) => {
      const price = Number(p?.price ?? 0);
      const rating = Number(p?.rating ?? 0);
      const qty = Number(p?.quantity ?? 0);
      const soldOut = Boolean(p?.sold_out);
      const st = String(p?.state_product ?? '');

      if (minP > 0 && price < minP) return false;
      if (maxP > 0 && price > maxP) return false;
      if (minR > 0 && rating < minR) return false;
      if (inStock && (soldOut || qty <= 0)) return false;
      if (state && state !== 'all' && st !== state) return false;
      return true;
    });
  }

  fetchProducts(q?: string) {
    this.loading.set(true);
    this.produitService.produitAllGet().subscribe({
      next: (resp: any) => {
        const raw = resp?.data || [];
        const mapped = raw.map(adaptProduitToProduct);
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
    const panierCode = clientCode;
    const produitCode = product.id as string;
    this.store.dispatch(PanierActions.addProduct({ panierCode, produitCode, quantite: 1 }));
  }
}
