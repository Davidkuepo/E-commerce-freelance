import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthActions, selectStatus, selectUser } from '../../store/auth/auth.store';
import { ButtonWrapper } from '../../components/form/wrappers';
import { Product } from '../../api';
import { CartService } from '../../api/api/cart.service';

/**
 * AppHeader - Top navigation bar with brand, search placeholder, auth state, and cart link.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  template: `
    <nav class="bg-white border-gray-200">
      <div class="container mx-auto px-4 flex flex-wrap items-center justify-between h-16">
        <!-- Brand -->
        <a routerLink="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <mat-icon color="primary">storefront</mat-icon>
          <span class="self-center text-2xl font-semibold whitespace-nowrap">E-Commerce</span>
        </a>

        <!-- Right zone: user + burger -->
        <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div class="relative" *ngIf="user$ | async as user; else guestActions">
            <!-- User avatar button -->
            <button
              type="button"
              class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
              (click)="toggleUserMenu()"
              aria-expanded="{{ userMenuOpen() }}"
            >
              <span class="sr-only">Open user menu</span>
              <img
                *ngIf="getAvatar(user)"
                [src]="getAvatar(user)"
                class="w-8 h-8 rounded-full"
                alt="user photo"
              />
              <span
                *ngIf="!getAvatar(user)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white"
              >
                {{ user?.name?.[0] || user?.email?.[0] || 'U' }}
              </span>
            </button>

            <!-- Dropdown -->
            <div
              class="absolute right-0 top-full mt-2 z-50 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-100"
              [class.hidden]="!userMenuOpen()"
              [class.block]="userMenuOpen()"
            >
              <div class="px-4 py-3">
                <span class="block text-sm text-gray-900">{{
                  (user$ | async)?.name || (user$ | async)?.email
                }}</span>
                <span class="block text-sm text-gray-500 truncate">{{
                  (user$ | async)?.email
                }}</span>
              </div>
              <ul class="py-2">
                <li>
                  <a
                    routerLink="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    (click)="closeUserMenu()"
                    >Profile</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/cart"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    (click)="closeUserMenu()"
                    >Panier</a
                  >
                </li>
                <li>
                  <button
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    (click)="logout()"
                  >
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <ng-template #guestActions>
            <div class="flex items-center gap-2">
              <a
                routerLink="/login"
                class="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                >Login</a
              >
              <a
                routerLink="/register"
                class="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                >Register</a
              >
            </div>
          </ng-template>

          <!-- Cart icon -->
          <a
            routerLink="/cart"
            class="ml-2 relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100"
            aria-label="Panier"
          >
            <mat-icon class="!text-base">shopping_cart</mat-icon>
            <span
              *ngIf="cartCount > 0"
              class="absolute -top-1 -right-1 text-[10px] leading-none rounded-full bg-amber-500 text-white px-1.5 py-0.5"
            >
              {{ cartCount }}
            </span>
          </a>

          <!-- Mobile burger -->
          <button
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            (click)="toggleCollapse()"
            aria-controls="navbar-user"
            aria-expanded="{{ collapseOpen() }}"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <!-- Collapsible nav -->
        <div
          class="items-center justify-between w-full md:flex md:w-auto md:order-1"
          [class.hidden]="!collapseOpen()"
          id="navbar-user"
        >
          <ul
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white"
          >
            <li>
              <a
                routerLink="/"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0"
                >Accueil</a
              >
            </li>
            <li>
              <a
                routerLink="/products"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0"
                >Produits</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  user$ = this.store.select(selectUser);
  status$ = this.store.select(selectStatus);
  cartCount = 0;
  headerQuery = '';
  collapseOpen = signal<boolean>(false);
  userMenuOpen = signal<boolean>(false);
  private guestCartPoll: any;

  ngOnInit(): void {
    this.loadCartCount();
    try {
      this.guestCartPoll = setInterval(() => this.updateGuestCartCount(), 3000);
    } catch {}
  }

  onHeaderQuery(e: Event): void {
    this.headerQuery = (e.target as HTMLInputElement)?.value ?? '';
  }

  onSearch(): void {
    this.router.navigate(['/products'], {
      queryParams: { q: this.headerQuery || null },
      queryParamsHandling: 'merge',
    });
  }

  toggleCollapse(): void {
    this.collapseOpen.update((v: boolean) => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v: boolean) => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  getAvatar(user: any): string | null {
    return user?.image || user?.avatar || null;
  }

  private loadCartCount(): void {
    this.cartService.cartGet().subscribe({
      next: (cart) => {
        const items = cart.items || [];
        this.cartCount = items.reduce((sum, it: any) => sum + (it?.quantity ?? 0), 0);
      },
      error: () => {
        this.updateGuestCartCount();
      },
    });
  }

  private updateGuestCartCount(): void {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('guestCart') : null;
      const cart = raw ? JSON.parse(raw) : { items: [] };
      const items = cart.items || [];
      this.cartCount = items.reduce((sum: number, it: any) => sum + (it?.quantity ?? 0), 0);
    } catch {
      this.cartCount = 0;
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.guestCartPoll) {
        clearInterval(this.guestCartPoll);
      }
    } catch {}
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.closeUserMenu();
  }
}

/**
 * ProductCard - Displays a product with image, name, price and an Add to Cart action.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonWrapper, RouterLink],
  template: `
    <div
      class="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <a [routerLink]="['/product', product?.id]" class="block">
        <img
          [src]="product?.images?.[0] || placeholder"
          [alt]="product?.name || 'Product image'"
          class="block w-full select-none"
          [style.height.px]="200"
        />
      </a>
      <div class="p-4 space-y-2">
        <a
          [routerLink]="['/product', product?.id]"
          class="block font-medium line-clamp-1 hover:underline"
        >
          {{ product?.name }}
        </a>
        <div class="flex items-center justify-between">
          <div class="text-cyan-700 font-semibold">
            {{ product?.price | number: '1.0-2' }} {{ product?.currency || 'USD' }}
          </div>
          <div class="flex items-center gap-1 text-amber-500">
            <svg class="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            <span class="text-sm text-gray-600">{{ product?.rating || 0 }}</span>
          </div>
        </div>
        <app-button color="primary" [fullWidth]="true" (clicked)="onAddToCart()">
          Add to cart
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  placeholder = 'https://via.placeholder.com/480x320?text=Product';

  onAddToCart() {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }
}

/**
 * AppFooter - modern footer with links and social icons.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="bg-white border-t border-gray-200 mt-10">
      <div class="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="flex items-center gap-2">
            <mat-icon color="primary">storefront</mat-icon>
            <span class="font-semibold">E-Commerce</span>
          </div>
          <p class="text-gray-600 mt-2 text-sm">
            Votre boutique en ligne pour des achats rapides et sécurisés.
          </p>
        </div>
        <div>
          <div class="font-semibold mb-3">Liens</div>
          <div class="space-y-2 text-sm">
            <a routerLink="/" class="block text-gray-700 hover:text-cyan-700">Accueil</a>
            <a routerLink="/products" class="block text-gray-700 hover:text-cyan-700">Produits</a>
            <a routerLink="/cart" class="block text-gray-700 hover:text-cyan-700">Panier</a>
          </div>
        </div>
        <div>
          <div class="font-semibold mb-3">Suivez-nous</div>
          <div class="flex items-center gap-3 text-gray-600">
            <mat-icon>facebook</mat-icon>
            <mat-icon>twitter</mat-icon>
            <mat-icon>instagram</mat-icon>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <div class="container mx-auto px-4 py-4 text-sm text-gray-500 flex justify-between">
          <span>&copy; {{ year }} E-Commerce. Tous droits réservés.</span>
          <div class="flex gap-4">
            <a routerLink="/" class="hover:underline">Conditions</a>
            <a routerLink="/" class="hover:underline">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooter {
  year = new Date().getFullYear();
}
