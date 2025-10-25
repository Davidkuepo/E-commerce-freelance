import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';

import { ProduitService } from '../../api/api/produit.service';
import { CartService } from '../../api/api/cart.service';
import { Product } from '../../api';
import { ButtonWrapper, BaseImage } from '../../components/form/wrappers';

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
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonWrapper, BaseImage],
  template: `
    <section class="container mx-auto py-8 max-w-4xl">
      <div *ngIf="loading()" class="flex items-center justify-center">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>

      <div *ngIf="!loading() && product()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <app-base-image
            [src]="product()?.images?.[0] || placeholder"
            [alt]="product()?.name || 'Product image'"
            [height]="320"
            [cover]="true"
            [rounded]="false"
          />
        </div>

        <div class="space-y-4">
          <h1 class="text-2xl font-semibold">{{ product()?.name }}</h1>
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            <span>{{ product()?.rating || 0 }}</span>
          </div>
          <div class="text-cyan-700 text-xl font-bold">
            {{ product()?.price | number: '1.0-2' }} {{ product()?.currency || 'USD' }}
          </div>
          <p class="text-gray-700 leading-relaxed">{{ product()?.description }}</p>
          <div class="flex items-center gap-2">
            <app-button color="primary" (clicked)="addToCart()">Ajouter au panier</app-button>
            <a routerLink="/" class="text-cyan-700 font-medium hover:underline"
              >Retour à la boutique</a
            >
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && !product()" class="text-center text-gray-600">
        Produit introuvable.
        <a routerLink="/" class="text-cyan-700 font-medium hover:underline ml-1"
          >Voir les produits</a
        >
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
    const panierCode = clientCode;
    const produitCode = p.id as string;
    this.store.dispatch(PanierActions.addProduct({ panierCode, produitCode, quantite: 1 }));
  }
}
