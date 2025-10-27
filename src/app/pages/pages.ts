import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { PanierActions } from '../store/panier/panier.store';

import { ProduitService } from '../api/api/produit.service';
import { CartService } from '../api/api/cart.service';
import { AuthActions, selectStatus, selectError } from '../store/auth/auth.store';
import { Product, LoginRequest, RegisterRequest, User } from '../api';
import { ProductCard } from '../components/layout/components';
import { ProductCartItemComponent } from '../components/product/product-cart-item.component';
import { ProductListItemComponent } from '../components/product/product-list-item.component';
import {
  TextInputWrapper,
  EmailInputWrapper,
  TextAreaWrapper,
  ButtonWrapper,
  BaseImage,
} from '../components/form/wrappers';
import { map } from 'rxjs';

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
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCartItemComponent,
    ProductListItemComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="container mx-auto py-4 space-y-4">
      <!-- Hero -->
      <div
        class="relative rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-500 text-white p-10 shadow-sm overflow-hidden"
      >
        <div class="relative z-10">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">Votre boutique en ligne</h1>
          <p class="opacity-90 mt-3 text-sm sm:text-base">
            Découvrez nos offres et les meilleures ventes d'aujourd'hui.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              routerLink="/cart"
              class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/20"
              >Voir le panier</a
            >
            <a
              routerLink="/"
              class="px-4 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition border border-white/20"
              >Nouveautés</a
            >
          </div>
        </div>
        <div class="absolute right-0 top-0 -mr-10 -mt-10 opacity-20 blur-2xl">
          <div class="w-56 h-56 rounded-full bg-white/30"></div>
        </div>
      </div>

      <!-- Search + Filters -->
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <input
            type="text"
            class="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-400"
            placeholder="Rechercher un produit..."
            [value]="query()"
            (input)="onQuery($event)"
          />
        </div>
        <button class="px-4 py-2 rounded-lg bg-cyan-600 text-white" (click)="search()">
          Rechercher
        </button>
      </div>

      <!-- Loading -->
      <div class="flex items-center justify-center" *ngIf="loading()">
        <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
      </div>

      <!-- Grid -->
      <ng-container *ngIf="!loading()">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          *ngIf="viewMode() === 'list'; else cardGrid"
        >
          <app-product-list-item
            *ngFor="let p of products()"
            [product]="p"
            (addToCart)="addToCart($event)"
          />
        </div>
        <ng-template #cardGrid>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <app-product-cart-item
              *ngFor="let p of products()"
              [product]="p"
              (addToCart)="addToCart($event)"
            />
          </div>
        </ng-template>
      </ng-container>

      <!-- Empty state -->
      <div class="text-center text-gray-500" *ngIf="!loading() && products().length === 0">
        Aucun produit trouvé.
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly produitService = inject(ProduitService);
  private readonly cartService = inject(CartService);
  private readonly snack = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  query = signal<string>('');
  viewMode = signal<'card' | 'list'>('card');

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') || '';
      const viewParam = (params.get('view') || '').toLowerCase();
      this.viewMode.set(viewParam === 'list' ? 'list' : 'card');
      this.query.set(q);
      this.fetchProducts(q || undefined);
    });
  }

  onQuery(e: Event) {
    const val = (e.target as HTMLInputElement)?.value ?? '';
    this.query.set(val);
  }

  search() {
    this.fetchProducts(this.query());
  }

  fetchProducts(q?: string) {
    this.loading.set(true);
    this.produitService.produitAllGet().subscribe({
      next: (resp: any) => {
        const raw = resp?.data || [];
        const mapped = raw.map(adaptProduitToProduct);
        this.products.set(mapped);
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container mx-auto py-8">
      <div
        class="flex flex-col md:flex-row h-[700px] w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg"
      >
        <div class="relative w-full md:w-1/2 h-64 md:h-auto block bg-gray-100">
          <img
            loading="eager"
            class="h-full w-full object-cover"
            src="https://picsum.photos/id/0/1200/700"
            alt="Laptop product"
          />
        </div>

        <div class="w-full flex flex-col items-center justify-start px-4 pt-16 md:pt-24">
          <form
            class="md:w-96 w-80 flex flex-col items-center justify-center"
            (submit)="onSubmit($event)"
          >
            <h2 class="text-4xl text-gray-900 font-medium">Sign in</h2>
            <p class="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>

            <button
              type="button"
              class="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div class="flex items-center gap-4 w-full my-5">
              <div class="w-full h-px bg-gray-300/90"></div>
              <p class="w-full text-nowrap text-sm text-gray-500/90">or sign in with email</p>
              <div class="w-full h-px bg-gray-300/90"></div>
            </div>

            <div
              class="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2"
            >
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="email"
                placeholder="Email id"
                class="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                [value]="email()"
                (input)="email.set($any($event.target).value || '')"
                required
              />
            </div>

            <div
              class="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2"
            >
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="password"
                placeholder="Password"
                class="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                [value]="password()"
                (input)="password.set($any($event.target).value || '')"
                required
              />
            </div>

            <div class="w-full flex items-center justify-between mt-8 text-gray-500/80">
              <div class="flex items-center gap-2">
                <input
                  class="h-5"
                  type="checkbox"
                  id="checkbox"
                  [checked]="rememberMe()"
                  (change)="onRememberChange($event)"
                />
                <label class="text-sm" for="checkbox">Remember me</label>
              </div>
              <a class="text-sm underline" [routerLink]="['/forgot-password']">Forgot password?</a>
            </div>

            <button
              type="submit"
              class="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
              [disabled]="(isLoading$ | async) ?? false"
            >
              Login
            </button>
            <p class="text-gray-500/90 text-sm mt-4">
              Don’t have an account?
              <a class="text-indigo-400 hover:underline" [routerLink]="['/register']">Sign up</a>
            </p>
          </form>

          <p class="text-sm text-red-600 mt-4" *ngIf="error$ | async as err">{{ err }}</p>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly store = inject(Store);

  email = signal<string>('');
  password = signal<string>('');
  rememberMe = signal<boolean>(false);

  isLoading$ = this.store.select(selectStatus).pipe(map((s) => s === 'loading'));
  error$ = this.store.select(selectError);

  onRememberChange(e: Event) {
    const checked = !!(e.target as HTMLInputElement)?.checked;
    this.rememberMe.set(checked);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const creds: LoginRequest = { email: this.email(), password: this.password() };
    this.store.dispatch(AuthActions.login({ credentials: creds }));
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, EmailInputWrapper, TextInputWrapper, ButtonWrapper],
  template: `
    <section class="container mx-auto py-8 max-w-md">
      <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>

      <form (submit)="onSubmit($event)" class="space-y-4">
        <app-text-input
          label="Nom"
          [value]="name()"
          (valueChange)="name.set($event)"
        ></app-text-input>

        <app-email-input
          label="Email"
          [value]="email()"
          (valueChange)="email.set($event)"
        ></app-email-input>

        <app-text-input
          label="Mot de passe"
          [type]="'password'"
          [value]="password()"
          (valueChange)="password.set($event)"
        ></app-text-input>

        <app-button color="primary" [fullWidth]="true" type="submit"> S'inscrire </app-button>
      </form>

      <p class="text-sm text-gray-600 mt-4">
        Déjà un compte ?
        <a routerLink="/login" class="text-cyan-700 font-medium hover:underline">Se connecter</a>
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly store = inject(Store);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  onSubmit(e: Event) {
    e.preventDefault();
    const payload: RegisterRequest = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
    };
    this.store.dispatch(AuthActions.register({ payload }));
  }
}

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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonWrapper,
    BaseImage,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="container mx-auto py-8 max-w-4xl">
      <div *ngIf="loading()" class="flex items-center justify-center">
        <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
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
            <mat-icon class="!text-base text-amber-500">star</mat-icon>
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
  private readonly snack = inject(MatSnackBar);
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

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCartItemComponent,
    ProductCard,
    ButtonWrapper,
    BaseImage,
    MatIconModule,
    MatProgressSpinnerModule,
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
                    'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&amp;auto=format&amp;fit=crop&amp;w=1200'
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
            <mat-icon class="!text-2xl text-emerald-600">local_shipping</mat-icon>
            <div>
              <div class="font-semibold">Livraison rapide</div>
              <div class="text-gray-600 text-sm">Partout au Cameroun, en 48-72h</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <mat-icon class="!text-2xl text-cyan-600">verified</mat-icon>
            <div>
              <div class="font-semibold">Qualité garantie</div>
              <div class="text-gray-600 text-sm">Produits vérifiés et conformes</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <mat-icon class="!text-2xl text-amber-600">payments</mat-icon>
            <div>
              <div class="font-semibold">Paiement sécurisé</div>
              <div class="text-gray-600 text-sm">Mobile Money, cartes, et plus</div>
            </div>
          </div>
          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3"
          >
            <mat-icon class="!text-2xl text-rose-600">support_agent</mat-icon>
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
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&amp;auto=format&amp;fit=crop&amp;w=600"
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
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&amp;auto=format&amp;fit=crop&amp;w=600"
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
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&amp;auto=format&amp;fit=crop&amp;w=600"
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
                src="https://images.unsplash.com/photo-1492447166138-50c3889fccb1?q=80&amp;auto=format&amp;fit=crop&amp;w=600"
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
          <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingDeals()">
          <app-product-cart-item *ngFor="let p of deals()" [product]="p" />
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
          <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingBest()">
          <app-product-cart-item *ngFor="let p of best()" [product]="p" />
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
          <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="!loadingNews()">
          <app-product-cart-item *ngFor="let p of news()" [product]="p" />
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
            <form class="mt-4 flex gap-2" (submit)="noop($event)">
              <input
                type="email"
                placeholder="Votre email"
                class="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-400"
              />
              <button
                class="px-5 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 transition"
                type="submit"
              >
                S'inscrire
              </button>
            </form>
          </div>
          <div class="md:w-1/2 block">
            <div class="rounded-xl overflow-hidden ring-1 ring-black/10">
              <app-base-image
                [src]="
                  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&amp;auto=format&amp;fit=crop&amp;w=900'
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

  deals = signal<Product[]>([]);
  best = signal<Product[]>([]);
  news = signal<Product[]>([]);

  loadingDeals = signal<boolean>(false);
  loadingBest = signal<boolean>(false);
  loadingNews = signal<boolean>(false);

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
        const mapped = raw.map(adaptProduitToProduct);
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

  noop(e: Event) {
    e.preventDefault();
  }
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCartItemComponent,
    ProductListItemComponent,
    ProductCard,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="container mx-auto py-6 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Tous les produits</h2>
        <div class="flex items-center gap-2">
          <input
            type="text"
            class="w-64 rounded-xl border border-gray-200 bg-white/80 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-400"
            placeholder="Rechercher..."
            [value]="query()"
            (input)="onQuery($event)"
            (keyup.enter)="search()"
          />
          <button class="px-4 py-2 rounded-lg bg-cyan-600 text-white" (click)="search()">
            Rechercher
          </button>

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
              <mat-icon>grid_view</mat-icon>
            </button>
            <button
              class="p-2 rounded-md"
              [class.bg-gray-200]="viewMode() === 'list'"
              title="Vue Liste"
              (click)="toggleView('list')"
            >
              <mat-icon>view_list</mat-icon>
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
            <label class="block text-xs text-gray-600 mb-1">Prix min</label>
            <input
              type="number"
              class="w-full rounded-md border border-gray-200 px-3 py-2"
              [value]="minPrice()"
              (input)="onMinPrice($event)"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Prix max</label>
            <input
              type="number"
              class="w-full rounded-md border border-gray-200 px-3 py-2"
              [value]="maxPrice()"
              (input)="onMaxPrice($event)"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Note minimale</label>
            <input
              type="number"
              min="0"
              max="5"
              class="w-full rounded-md border border-gray-200 px-3 py-2"
              [value]="minRating()"
              (input)="onMinRating($event)"
            />
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
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" [checked]="inStockOnly()" (change)="onInStockChange($event)" />
            En stock seulement
          </label>
        </div>
      </div>

      <div class="flex items-center justify-center" *ngIf="loading()">
        <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>
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
  private readonly snack = inject(MatSnackBar);
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

  onQuery(e: Event) {
    const val = (e.target as HTMLInputElement)?.value ?? '';
    this.query.set(val);
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
  onInStockChange(e: Event) {
    const checked = !!(e.target as HTMLInputElement)?.checked;
    this.inStockOnly.set(checked);
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

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar -->
        <aside
          class="lg:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm p-4 h-fit"
        >
          <div class="text-sm text-gray-500 mb-2">Menu</div>
          <nav class="space-y-1">
            <a
              *ngFor="let item of menus()"
              [routerLink]="item.link"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              <mat-icon class="!text-base text-cyan-600">{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          </nav>
        </aside>

        <!-- Content -->
        <main class="lg:col-span-9">
          <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardPage {
  private readonly store = inject(Store);
  roles = signal<string[]>([]);

  ngOnInit(): void {
    // Extract role names from user in localStorage; support both string and object roles.
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      const rolesRaw = u?.roles || [];
      const roleNames = Array.isArray(rolesRaw)
        ? rolesRaw
            .map((r: any) => (typeof r === 'string' ? r : r?.roleName || r?.roleCode || ''))
            .filter((v: any) => !!v)
        : [];
      this.roles.set(roleNames);
    } catch {
      this.roles.set([]);
    }
  }

  menus() {
    const rolesLc = (this.roles() || []).map((r) => String(r || '').toLowerCase());
    const isAdmin = rolesLc.some((r) => r.includes('admin'));
    const base = [
      { label: 'Profil', icon: 'person', link: '/profile' },
      { label: 'Commandes', icon: 'receipt_long', link: '/profile/orders' },
      { label: 'Paramètres', icon: 'settings', link: '/profile/settings' },
    ];
    if (rolesLc.includes('seller')) {
      base.push({ label: 'Mes produits', icon: 'inventory_2', link: '/profile/products' });
      base.push({ label: 'Rapports', icon: 'insights', link: '/profile/reports' });
    }
    if (isAdmin) {
      base.push({ label: 'Administration', icon: 'admin_panel_settings', link: '/profile/admin' });
      base.push({ label: 'Utilisateurs', icon: 'group', link: '/profile/users' });
      base.push({ label: 'Créer produit', icon: 'add_box', link: '/profile/products/new' });
    }
    return base;
  }
}

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    EmailInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-br from-cyan-600 via-sky-600 to-emerald-500 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center"
              >
                <mat-icon>key</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Vérification OTP</div>
                <div class="text-sm text-gray-600">
                  Entrez le code reçu pour valider votre session
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onVerify($event)">
              <app-text-input
                label="Code OTP"
                [value]="otp()"
                (valueChange)="otp.set($event)"
                placeholder="Ex: 123456"
              ></app-text-input>

              <div class="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <div class="text-sm text-gray-700 mb-3">
                  Besoin d'un nouveau code ? Renseignez votre identifiant et renvoyez l'OTP.
                </div>
                <app-text-input
                  label="Identifiant (email ou login)"
                  [value]="login()"
                  (valueChange)="login.set($event)"
                  placeholder="email@domaine.com"
                ></app-text-input>
                <div class="mt-3">
                  <app-button color="accent" (clicked)="onResendOtp()">Renvoyer OTP</app-button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit">Vérifier</app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpPage {
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  otp = signal<string>('');
  login = signal<string>('');

  onVerify(e: Event) {
    e.preventDefault();
    const code = (this.otp() || '').trim();
    if (!code) {
      this.snack.open('Veuillez saisir le code OTP', undefined, { duration: 2500 });
      return;
    }
    this.store.dispatch(AuthActions.verifyOtp({ payload: { otpCode: code } as any }));
  }

  onResendOtp() {
    let login = (this.login() || '').trim();
    if (!login) {
      try {
        const raw = localStorage.getItem('user');
        const u = raw ? JSON.parse(raw) : null;
        login = u?.email || u?.username || '';
      } catch {}
    }
    if (!login) {
      this.snack.open('Renseignez votre email/login pour renvoyer l’OTP', undefined, {
        duration: 2500,
      });
      return;
    }
    this.store.dispatch(AuthActions.resendOtp({ login }));
  }
}

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    EmailInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-sky-500 to-cyan-600 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center"
              >
                <mat-icon>mark_email_unread</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Vérification d'email</div>
                <div class="text-sm text-gray-600">Validez votre email à l’aide d’un jeton</div>
              </div>
            </div>

            <div class="p-6 space-y-6">
              <form class="space-y-4" (submit)="onVerify($event)">
                <app-text-input
                  label="Jeton de vérification"
                  [value]="token()"
                  (valueChange)="token.set($event)"
                  placeholder="Collez ici le token reçu par email"
                ></app-text-input>

                <div class="flex items-center justify-between">
                  <a
                    routerLink="/login"
                    class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                  >
                    <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                  </a>
                  <app-button color="primary" type="submit">Vérifier l'email</app-button>
                </div>
              </form>

              <div class="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <div class="flex items-start gap-2">
                  <mat-icon class="!text-base text-amber-600 mt-0.5">info</mat-icon>
                  <div class="text-sm text-gray-700">
                    Vous n'avez pas reçu de token ? Envoyez-en un nouveau à votre adresse email.
                  </div>
                </div>
                <form class="mt-3 flex flex-col gap-3 md:flex-row" (submit)="onSendToken($event)">
                  <div class="flex-1">
                    <app-email-input
                      label="Votre email"
                      [value]="email()"
                      (valueChange)="email.set($event)"
                    ></app-email-input>
                  </div>
                  <div class="md:self-end">
                    <app-button color="accent" type="submit">Envoyer le token</app-button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPage {
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  token = signal<string>('');
  email = signal<string>('');

  onVerify(e: Event) {
    e.preventDefault();
    const t = (this.token() || '').trim();
    if (!t) {
      this.snack.open('Veuillez saisir le jeton de vérification', undefined, { duration: 2500 });
      return;
    }
    this.store.dispatch(AuthActions.verifyEmail({ payload: { token: t } as any }));
  }

  onSendToken(e: Event) {
    e.preventDefault();
    const em = (this.email() || '').trim();
    if (!em) {
      this.snack.open('Veuillez saisir votre email', undefined, { duration: 2500 });
      return;
    }
    this.store.dispatch(AuthActions.sendTokenVerifyEmail({ payload: { userEmail: em } as any }));
  }
}

@Component({
  selector: 'app-request-reset-token',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmailInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-rose-500 via-amber-500 to-cyan-600 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center"
              >
                <mat-icon>lock_reset</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Mot de passe oublié</div>
                <div class="text-sm text-gray-600">
                  Recevez un jeton de réinitialisation par email
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onSend($event)">
              <app-email-input
                label="Votre email"
                [value]="email()"
                (valueChange)="email.set($event)"
              ></app-email-input>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit">Envoyer le jeton</app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestResetTokenPage {
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  email = signal<string>('');

  onSend(e: Event) {
    e.preventDefault();
    const em = (this.email() || '').trim();
    if (!em) {
      this.snack.open('Veuillez saisir votre email', undefined, { duration: 2500 });
      return;
    }
    this.store.dispatch(AuthActions.sendTokenResetPassword({ userEmail: em }));
  }
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextInputWrapper,
    ButtonWrapper,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <section class="min-h-[calc(100vh-64px-240px)] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
          <div
            class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-cyan-600 to-emerald-500 opacity-20"
          ></div>
          <div class="relative bg-white">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
              >
                <mat-icon>password</mat-icon>
              </div>
              <div>
                <div class="font-semibold text-lg">Réinitialiser le mot de passe</div>
                <div class="text-sm text-gray-600">
                  Collez le jeton reçu et définissez un nouveau mot de passe
                </div>
              </div>
            </div>

            <form class="p-6 space-y-4" (submit)="onReset($event)">
              <app-text-input
                label="Jeton"
                [value]="token()"
                (valueChange)="token.set($event)"
                placeholder="Token reçu par email"
              ></app-text-input>

              <app-text-input
                label="Nouveau mot de passe"
                [type]="'password'"
                [value]="password()"
                (valueChange)="password.set($event)"
                placeholder="Au moins 6 caractères"
              ></app-text-input>

              <div class="rounded-md border p-3 text-xs text-gray-600">
                Conseil: utilisez une phrase secrète et activez la vérification en deux étapes si
                disponible.
              </div>

              <div class="flex items-center justify-between">
                <a
                  routerLink="/login"
                  class="text-cyan-700 text-sm hover:underline flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon> Retour
                </a>
                <app-button color="primary" type="submit">Mettre à jour</app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage {
  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  token = signal<string>('');
  password = signal<string>('');

  onReset(e: Event) {
    e.preventDefault();
    const t = (this.token() || '').trim();
    const p = (this.password() || '').trim();
    if (!t || !p) {
      this.snack.open('Renseignez le token et le nouveau mot de passe', undefined, {
        duration: 2500,
      });
      return;
    }
    this.store.dispatch(AuthActions.resetPassword({ payload: { token: t, password: p } as any }));
  }
}

@Component({
  selector: 'app-profile-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div class="flex items-center gap-2 mb-3">
          <mat-icon class="!text-base text-cyan-600">receipt_long</mat-icon>
          <h2 class="text-2xl font-semibold">Mes commandes</h2>
        </div>
        <p class="text-gray-600">Historique de commandes à venir.</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileOrdersPage {}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div class="flex items-center gap-2 mb-3">
          <mat-icon class="!text-base text-cyan-600">settings</mat-icon>
          <h2 class="text-2xl font-semibold">Paramètres</h2>
        </div>
        <p class="text-gray-600">Gestion des paramètres du compte.</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPage {}

@Component({
  selector: 'app-profile-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <mat-icon class="!text-base text-cyan-600">inventory_2</mat-icon>
            <h2 class="text-2xl font-semibold">Gestion des produits</h2>
          </div>
          <a
            routerLink="/profile/products"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
          >
            <mat-icon class="!text-base">add_box</mat-icon>
            Gestion produits
          </a>
        </div>
        <p class="text-gray-600 mt-3">Liste et gestion des produits (à venir).</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProductsPage {}

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
    <section class="container mx-auto py-10 max-w-4xl">
      <div class="rounded-3xl border border-gray-100 bg-white shadow-lg overflow-hidden">
        <!-- Header band -->
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-500 opacity-10"
          ></div>
          <div class="relative px-6 py-5 flex items-center gap-3 border-b border-gray-100">
            <div
              class="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm"
            >
              <mat-icon class="!text-2xl">add_box</mat-icon>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-gray-800">Créer un nouveau produit</h2>
              <p class="text-sm text-gray-500">
                Renseignez les champs ci-dessous. Un aperçu s’actualise à droite.
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Saving indicator -->
          <div
            *ngIf="isSaving()"
            class="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-6"
          >
            <mat-icon class="!text-base animate-spin">autorenew</mat-icon>
            <span>Enregistrement en cours...</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Form -->
            <form class="space-y-6" (submit)="onSubmit($event)">
              <!-- Code & Nom -->
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

              <!-- Prix & Stock -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-text-input
                  label="Prix (EUR)"
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

              <!-- Catégorie -->
              <app-text-input
                label="Catégorie"
                [value]="categorie()"
                (valueChange)="categorie.set($event)"
              >
              </app-text-input>

              <!-- État -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">État</label>
                <div class="relative">
                  <select
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white px-3 py-2 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    [value]="state()"
                    (change)="state.set($any($event.target).value || 'ACTIVE')"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                  <mat-icon
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    >expand_more</mat-icon
                  >
                </div>
              </div>

              <!-- Description -->
              <app-textarea
                label="Description"
                [value]="description()"
                (valueChange)="description.set($event)"
              >
              </app-textarea>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-6 border-t border-gray-100">
                <a
                  routerLink="/profile/products"
                  class="text-sm text-gray-600 hover:text-cyan-600 transition-colors flex items-center gap-1"
                >
                  <mat-icon class="!text-base">arrow_back</mat-icon>
                  <span>Retour</span>
                </a>

                <app-button
                  color="primary"
                  type="submit"
                  class="!bg-cyan-600 hover:!bg-cyan-700 text-white rounded-lg shadow-md px-6 py-2 transition-all duration-300"
                  [class.opacity-60]="isSaving()"
                  [class.pointer-events-none]="isSaving()"
                >
                  <mat-icon class="!text-base mr-2">save</mat-icon>
                  Enregistrer
                </app-button>
              </div>
            </form>

            <!-- Live Preview -->
            <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:sticky md:top-6 h-fit">
              <div class="flex items-center gap-2 mb-3">
                <mat-icon class="!text-base text-cyan-600">visibility</mat-icon>
                <div class="font-semibold">Aperçuq</div>
              </div>
              <div class="space-y-2 text-sm text-gray-700">
                <div class="flex justify-between">
                  <span class="text-gray-500">Code</span>
                  <span class="font-medium">{{ produitCode() || '—' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Nom</span>
                  <span class="font-medium">{{ name() || '—' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Prix</span>
                  <span class="font-medium">{{ price() || '0' }} EUR</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Stock</span>
                  <span class="font-medium">{{ stock() || '0' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Catégorie</span>
                  <span class="font-medium">{{ categorie() || '—' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">État</span>
                  <span class="font-medium">{{ state() }}</span>
                </div>
                <div>
                  <div class="text-gray-500 mb-1">Description</div>
                  <div
                    class="rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600 min-h-[60px]"
                  >
                    {{ description() || 'Aucune description' }}
                  </div>
                </div>
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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div class="flex items-center gap-2 mb-3">
          <mat-icon class="!text-base text-amber-600">admin_panel_settings</mat-icon>
          <h2 class="text-2xl font-semibold">Administration</h2>
        </div>
        <p class="text-gray-600">Outils d'administration (à venir).</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage {}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="container mx-auto py-6">
      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div class="flex items-center gap-2 mb-3">
          <mat-icon class="!text-base text-emerald-600">group</mat-icon>
          <h2 class="text-2xl font-semibold">Utilisateurs</h2>
        </div>
        <p class="text-gray-600">Gestion des utilisateurs (à venir).</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {}
