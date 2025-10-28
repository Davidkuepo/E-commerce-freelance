import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div
      class="product relative rounded-xl border border-gray-200 bg-white shadow-sm p-3 md:p-4"
      [ngClass]="{ watermark: product?.sold_out }"
    >
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Image -->
        <div class="md:col-span-3">
          <a
            (click)="onProductClick()"
            class="block rounded-lg overflow-hidden ring-1 ring-black/5"
          >
            <img
              class="w-full h-44 md:h-36 object-cover"
              [src]="getImage(product)"
              [alt]="getTitle(product)"
            />
          </a>

          <!-- Actions overlay (mobile hidden) -->
          <div class="product_action_box mt-2 md:hidden">
            <ul class="list_none pr_action_btn flex gap-3 text-gray-600">
              <li class="add-to-cart">
                <a
                  (click)="onAddToCart()"
                  class="inline-flex items-center gap-1 text-cyan-700 hover:underline"
                >
                  <mat-icon class="!text-base">add_shopping_cart</mat-icon> Ajouter au panier
                </a>
              </li>
              <li>
                <a href="#" class="inline-flex items-center gap-1 hover:text-gray-900">
                  <mat-icon class="!text-base">compare_arrows</mat-icon>
                </a>
              </li>
              <li>
                <a href="#" class="inline-flex items-center gap-1 hover:text-gray-900">
                  <mat-icon class="!text-base">visibility</mat-icon>
                </a>
              </li>
              <li>
                <a href="#" class="inline-flex items-center gap-1 hover:text-gray-900">
                  <mat-icon class="!text-base">favorite_border</mat-icon>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Info -->
        <div class="md:col-span-9">
          <div class="flex flex-col h-full">
            <div class="flex items-start justify-between gap-3">
              <h6 class="product_title text-base md:text-lg font-medium leading-snug">
                <a (click)="onProductClick()" class="hover:underline cursor-pointer">
                  {{ getTitle(product) }}
                  <ng-container *ngIf="product?.suffixe"> {{ product?.suffixe }}</ng-container>
                </a>
              </h6>

              <!-- On sale badge -->
              <div class="on_sale" *ngIf="product?.remise && product?.remise > 0">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-600 text-white"
                >
                  -{{ product?.remise }}%
                </span>
              </div>
            </div>

            <!-- Price / TVA -->
            <div class="product_price mt-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="price font-semibold text-cyan-700">
                  {{
                    priceTTC(product) | currency: product?.currency || 'XAF' : 'symbol' : '1.2-2'
                  }}
                </span>
                <span class="text-gray-500">TTC</span>
              </div>
              <div class="text-xs text-rose-700 mt-1 flex items-center gap-1">
                <mat-icon class="!text-base">info</mat-icon>
                Dont TVA :
                {{
                  num(product?.price || 0) * num(product?.pourcentages_tva || 0)
                    | currency: product?.currency || 'XAF' : 'symbol' : '1.2-2'
                }}
              </div>

              <!-- Optional initial price, savings -->
              <div
                class="product_prices mt-2 text-xs text-gray-600"
                *ngIf="product?.initial_value && product?.initial_value !== 0"
              >
                Prix Neuf : <del>{{ product?.initial_value }}&nbsp;€</del>
                <div class="mt-1 flex items-center gap-2" *ngIf="product?.display_value">
                  Economisez :
                  {{ num(product?.initial_value) - num(product?.price) | number: '1.0-2' }} €
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-600 text-white"
                  >
                    {{
                      ((num(product?.price) - num(product?.initial_value)) /
                        num(product?.initial_value)) *
                        100 | number: '1.0-2'
                    }}
                    %
                  </span>
                </div>
              </div>
            </div>

            <!-- Stock state -->
            <div class="mt-3 flex items-center">
              <span
                class="inline-flex w-2.5 h-2.5 rounded-full"
                [ngClass]="{
                  'bg-green-600': num(product?.quantity || 0) > 11,
                  'bg-amber-500':
                    num(product?.quantity || 0) <= 11 && num(product?.quantity || 0) > 0,
                  'bg-gray-400': num(product?.quantity || 0) === 0 || product?.sold_out,
                }"
              ></span>
              <span
                class="ml-2 text-sm"
                [ngClass]="{
                  'text-green-700': num(product?.quantity || 0) > 11,
                  'text-amber-700':
                    num(product?.quantity || 0) <= 11 && num(product?.quantity || 0) > 0,
                  'text-gray-600': num(product?.quantity || 0) === 0 || product?.sold_out,
                }"
              >
                {{
                  product?.sold_out || num(product?.quantity || 0) === 0
                    ? 'En rupture de stock'
                    : num(product?.quantity || 0) > 11
                      ? 'Disponible'
                      : 'Bientôt en rupture, plus que ' + num(product?.quantity || 0)
                }}
              </span>
            </div>

            <!-- Attributes -->
            <div class="mt-3 text-xs text-gray-700 space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-gray-500">Etat de l'appareil :</span>
                <span class="on_sale font-medium">{{ product?.state_product }}</span>
              </div>
              <div *ngIf="product?.reference_constructeur">
                Reference constructeur: {{ product?.reference_constructeur }}
              </div>
              <div *ngIf="product?.reference_shlife_it">
                Reference Shlife IT: {{ product?.reference_shlife_it }}
              </div>
            </div>

            <!-- Rating -->
            <div class="rating_wrap mt-3 flex items-center gap-1">
              <ng-container *ngFor="let s of [1, 2, 3, 4, 5]; let i = index">
                <mat-icon
                  class="!text-base"
                  [ngClass]="{
                    'text-amber-500': (product?.rating || 0) > i,
                    'text-gray-300': (product?.rating || 0) <= i,
                  }"
                >
                  {{ (product?.rating || 0) > i ? 'star' : 'star_border' }}
                </mat-icon>
              </ng-container>
              <span class="rating_num text-xs text-gray-500" *ngIf="product?.reviewsCount"
                >({{ product?.reviewsCount }})</span
              >
            </div>

            <!-- Description -->
            <div class="pr_desc mt-3 text-sm text-gray-700" *ngIf="product?.description">
              <p class="text-justify">
                {{ product?.description }}
              </p>
            </div>

            <!-- Actions (desktop) -->
            <div class="list_product_action_box mt-4 hidden md:block">
              <ul class="list_none pr_action_btn flex items-center gap-4">
                <li
                  (click)="onAddToCart()"
                  class="add-to-cart"
                  [class.opacity-50]="product?.sold_out"
                  [class.pointer-events-none]="product?.sold_out"
                  [title]="product?.sold_out ? 'Indisponible' : 'Ajouter au panier'"
                >
                  <a
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
                  >
                    <mat-icon class="!text-base">add_shopping_cart</mat-icon> Ajouter au panier
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <mat-icon class="!text-base">compare_arrows</mat-icon>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <mat-icon class="!text-base">visibility</mat-icon>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <mat-icon class="!text-base">favorite_border</mat-icon>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Sold out watermark -->
      <div class="sold-out-badge absolute top-3 left-3" *ngIf="product?.sold_out">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-white"
        >
          Rupture de stock
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      .product.watermark::after {
        content: 'RUPTURE';
        position: absolute;
        top: 16px;
        left: -18px;
        transform: rotate(-20deg);
        color: rgba(17, 24, 39, 0.15);
        font-weight: 800;
        font-size: 26px;
        letter-spacing: 2px;
        pointer-events: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListItemComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  num(v: any): number {
    return Number(v ?? 0);
  }

  onProductClick(): void {
    // Fallback: navigate via anchor in template or handle with routerLink elsewhere
  }

  onAddToCart(): void {
    if (!this.product?.sold_out) {
      this.addToCart.emit(this.product);
    }
  }

  getTitle(p: any): string {
    return p?.title || p?.name || 'Produit';
  }

  getImage(p: any): string {
    // Prefer direct image field if provided by backend (Produit.image)
    const direct = typeof p?.image === 'string' ? p.image.trim() : '';
    if (direct) return direct;

    // Otherwise, use first image from images[] if present
    const img = p?.images?.[0];
    if (typeof img === 'string' && img.trim()) return img.trim();
    if (img?.image_resize) return img.image_resize;

    // Fallback placeholder
    return 'https://via.placeholder.com/480x320?text=Product';
  }

  priceTTC(p: any): number {
    const price = this.num(p?.price || 0);
    const tva = this.num(p?.pourcentages_tva || 0);
    return price + price * tva;
  }
}
