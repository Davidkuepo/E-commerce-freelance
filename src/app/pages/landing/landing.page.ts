import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProduitService } from '../../api/api/produit.service';
import { Product } from '../../api';
import { Store } from '@ngrx/store';
import { PanierActions } from '../../store/panier/panier.store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductCard } from '../../components/layout/components';
import { ProductCartItemComponent } from '../../components/product/product-cart-item.component';
import { ButtonWrapper, BaseImage, EmailInputWrapper } from '../../components/form/wrappers';

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
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCartItemComponent,
    ProductCard,
    ButtonWrapper,
    EmailInputWrapper,
    BaseImage,
    MatSnackBarModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px-240px)]">
      <!-- Hero -->
      <div class="relative overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-br from-cyan-700 via-sky-600 to-emerald-600"
        ></div>
        <div class="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative container mx-auto px-4 py-16 text-white">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 class="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Achetez mieux. Vendez plus.
              </h1>
              <p class="mt-4 text-white/90 text-lg">
                Découvrez des produits de qualité et profitez de nos meilleures offres du moment.
              </p>
              <div class="mt-6 flex gap-3">
                <a
                  routerLink="/products"
                  class="px-5 py-3 rounded-xl bg-white text-cyan-700 font-semibold shadow hover:shadow-md transition"
                >
                  Découvrir les produits
                </a>
                <a
                  routerLink="/cart"
                  class="px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
                >
                  Voir mon panier
                </a>
              </div>
            </div>
            <div class="md:w-1/2 block">
              <div class="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                <app-base-image
                  [src]="
                    'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&auto=format&fit=crop&w=1200'
                  "
                  [alt]="'Hero banner'"
                  [height]="360"
                  [cover]="true"
                  [rounded]="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature highlights -->
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <svg class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 5h13v11H3zM18 8h4l-2-3h-2zM6 18a2 2 0 112 2 2 2 0 01-2-2m10 0a2 2 0 112 2 2 2 0 01-2-2"
              />
            </svg>
            <div>
              <div class="font-semibold">Livraison rapide</div>
              <div class="text-gray-600 text-sm">Partout au Cameroun, en 48-72h</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <svg class="w-6 h-6 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
            </svg>
            <div>
              <div class="font-semibold">Qualité garantie</div>
              <div class="text-gray-600 text-sm">Produits vérifiés et conformes</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <svg class="w-6 h-6 text-amber-600" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M3 5h18v14H3zM3 8h18v3H3z" />
            </svg>
            <div>
              <div class="font-semibold">Paiement sécurisé</div>
              <div class="text-gray-600 text-sm">Mobile Money, cartes, et plus</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <svg class="w-6 h-6 text-rose-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 017 7v3a4 4 0 01-4 4h-2v-2h2a2 2 0 002-2V9a5 5 0 10-10 0v8H6v-8a7 7 0 016-7z"
              />
            </svg>
            <div>
              <div class="font-semibold">Support 7j/7</div>
              <div class="text-gray-600 text-sm">Nous sommes là pour vous aider</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category teaser -->
      <div class="container mx-auto px-4 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Catégories populaires</h2>
          <a routerLink="/products" class="text-cyan-700 hover:underline">Voir tout</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            routerLink="/products"
            class="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div class="h-40 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop&w=600"
                alt="Tech"
              />
            </div>
            <div class="p-3 font-medium">Technologie</div>
          </a>
          <a
            routerLink="/products"
            class="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div class="h-40 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&auto=format&fit=crop&w=600"
                alt="Fashion"
              />
            </div>
            <div class="p-3 font-medium">Mode</div>
          </a>
          <a
            routerLink="/products"
            class="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div class="h-40 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&auto=format&fit=crop&w=600"
                alt="Sneakers"
              />
            </div>
            <div class="p-3 font-medium">Chaussures</div>
          </a>
          <a
            routerLink="/products"
            class="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div class="h-40 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1492447166138-50c3889fccb1?q=80&auto=format&fit=crop&w=600"
                alt="Home"
              />
            </div>
            <div class="p-3 font-medium">Maison</div>
          </a>
        </div>
      </div>

      <!-- Deals section -->
      <div class="container mx-auto px-4 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Meilleures offres</h2>
          <a
            [routerLink]="['/products']"
            [queryParams]="{ q: 'deal' }"
            class="text-cyan-700 hover:underline"
            >Voir tout</a
          >
        </div>
        <div class="flex items-center justify-center" *ngIf="loadingDeals()">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingDeals()">
          <app-product-cart-item
            *ngFor="let p of deals()"
            [product]="p"
            (addToCart)="addToCart($event)"
          />
        </div>
        <div class="text-center text-gray-500" *ngIf="!loadingDeals() && deals().length === 0">
          Aucune offre pour le moment.
        </div>
      </div>

      <!-- Best sellers -->
      <div class="container mx-auto px-4 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Meilleures ventes</h2>
          <a
            [routerLink]="['/products']"
            [queryParams]="{ q: 'best' }"
            class="text-cyan-700 hover:underline"
            >Voir tout</a
          >
        </div>
        <div class="flex items-center justify-center" *ngIf="loadingBest()">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingBest()">
          <app-product-cart-item
            *ngFor="let p of best()"
            [product]="p"
            (addToCart)="addToCart($event)"
          />
        </div>
        <div class="text-center text-gray-500" *ngIf="!loadingBest() && best().length === 0">
          Aucune meilleure vente pour le moment.
        </div>
      </div>

      <!-- New arrivals -->
      <div class="container mx-auto px-4 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Nouveautés</h2>
          <a
            [routerLink]="['/products']"
            [queryParams]="{ q: 'new' }"
            class="text-cyan-700 hover:underline"
            >Voir tout</a
          >
        </div>
        <div class="flex items-center justify-center" *ngIf="loadingNews()">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingNews()">
          <app-product-cart-item
            *ngFor="let p of news()"
            [product]="p"
            (addToCart)="addToCart($event)"
          />
        </div>
        <div class="text-center text-gray-500" *ngIf="!loadingNews() && news().length === 0">
          Aucune nouveauté pour le moment.
        </div>
      </div>

      <!-- Newsletter CTA -->
      <div class="container mx-auto px-4 pb-16">
        <div
          class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-6"
        >
          <div class="flex-1">
            <h3 class="text-xl font-semibold">Recevez nos offres et nouveautés</h3>
            <p class="text-gray-600 mt-2">
              Inscrivez-vous à notre newsletter pour ne rien manquer.
            </p>
            <form
              class="mt-4 flex flex-col gap-3 md:flex-row"
              (submit)="onNewsletterSubmit($event)"
            >
              <div class="flex-1">
                <app-email-input
                  label="Votre email"
                  [value]="newsletterEmail()"
                  (valueChange)="newsletterEmail.set($event)"
                  [error]="newsletterError()"
                ></app-email-input>
              </div>
              <div class="md:self-end">
                <app-button color="primary" type="submit">S'inscrire</app-button>
              </div>
            </form>
          </div>
          <div class="md:w-1/2 block">
            <div class="rounded-xl overflow-hidden ring-1 ring-black/10">
              <app-base-image
                [src]="
                  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&auto=format&fit=crop&w=900'
                "
                [alt]="'Newsletter'"
                [height]="180"
                [cover]="true"
                [rounded]="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly produitService = inject(ProduitService);
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  deals = signal<Product[]>([]);
  best = signal<Product[]>([]);
  news = signal<Product[]>([]);

  loadingDeals = signal<boolean>(false);
  loadingBest = signal<boolean>(false);
  loadingNews = signal<boolean>(false);

  newsletterEmail = signal<string>('');
  newsletterError = signal<string | null>(null);

  ngOnInit() {
    this.fetchSection('deals', 'deal');
    this.fetchSection('best', 'best');
    this.fetchSection('news', 'new');
  }

  fetchSection(section: 'deals' | 'best' | 'news', q: string) {
    const setLoading = (v: boolean) => {
      if (section === 'deals') this.loadingDeals.set(v);
      if (section === 'best') this.loadingBest.set(v);
      if (section === 'news') this.loadingNews.set(v);
    };
    setLoading(true);
    this.produitService.produitAllGet().subscribe({
      next: (resp: any) => {
        const raw = resp?.data || [];
        const mapped = raw
          .map(adaptProduitToProduct)
          .filter((p: any) => p.state_product !== 'INACTIVE');
        if (section === 'deals') this.deals.set(mapped);
        if (section === 'best') this.best.set(mapped);
        if (section === 'news') this.news.set(mapped);
        setLoading(false);
      },
      error: () => {
        if (section === 'deals') this.deals.set([]);
        if (section === 'best') this.best.set([]);
        if (section === 'news') this.news.set([]);
        setLoading(false);
      },
    });
  }

  onNewsletterSubmit(e: Event) {
    e.preventDefault();
    const em = (this.newsletterEmail() || '').trim();
    if (!em) {
      this.newsletterError.set('Veuillez saisir votre email');
      return;
    }
    this.newsletterError.set(null);
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
    // Authenticated flow: use Panier API
    this.store.dispatch(
      PanierActions.addProduct({ panierCode: panierCode, produitCode, quantite: 1 }),
    );
  }
}
