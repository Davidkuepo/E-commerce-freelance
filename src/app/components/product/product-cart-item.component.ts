import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="product_box text-center relative" [ngClass]="{ watermark: product?.sold_out }">
      <div class="sold-out-badge" *ngIf="product?.sold_out">
        <span>Rupture de stock</span>
      </div>
      <div class="discount-badge" *ngIf="product?.remise && product?.remise > 0">
        <span>-{{ product?.remise }}%</span>
      </div>

      <div class="product_img relative overflow-hidden rounded-xl bg-white">
        <a [routerLink]="['/product', productId]" [queryParams]="getQueryParams()">
          <img
            class="w-full h-48 object-cover"
            [src]="getImage(product)"
            [alt]="getTitle(product)"
          />
          <div class="image-overlay"></div>
        </a>

        <div class="product_action_box">
          <ul class="list_none pr_action_btn">
            <li class="action-item">
              <a href="#" title="Comparer">
                <mat-icon>compare_arrows</mat-icon>
              </a>
            </li>
            <li class="action-item">
              <a href="#" title="Aperçu rapide">
                <mat-icon>visibility</mat-icon>
              </a>
            </li>
            <li class="action-item">
              <a href="#" title="Ajouter aux favoris">
                <mat-icon>favorite_border</mat-icon>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="product_info p-3">
        <h6 class="product_title leading-snug line-clamp-2">
          <a [routerLink]="['/product', productId]" [queryParams]="getQueryParams()">
            {{ getTitle(product) }}
            <ng-container *ngIf="product?.suffixe">{{ product?.suffixe }}</ng-container>
          </a>
        </h6>

        <div class="product_price mt-2 flex items-center justify-center gap-2">
          <span class="price-label text-xs text-gray-500">Prix TTC</span>
          <span class="price font-semibold text-cyan-700">
            {{ priceTTC(product) | currency: product?.currency || 'EUR' : 'symbol' : '1.2-2' }}
          </span>
        </div>

        <div
          class="tax-info mt-1 text-xs text-gray-500 flex items-center justify-center gap-1"
          *ngIf="product?.pourcentages_tva"
        >
          <mat-icon class="!text-base">info</mat-icon>
          <span
            >Dont TVA :
            {{
              product?.price * product?.pourcentages_tva
                | currency: product?.currency || 'EUR' : 'symbol' : '1.2-2'
            }}
          </span>
        </div>

        <div class="rating_wrap mt-2 flex items-center justify-center gap-1 text-amber-500">
          <ng-container *ngFor="let s of [1, 2, 3, 4, 5]; let i = index">
            <mat-icon class="!text-base">{{
              (product?.rating || 0) > i ? 'star' : 'star_border'
            }}</mat-icon>
          </ng-container>
          <span class="rating_num text-xs text-gray-500" *ngIf="product?.reviewsCount"
            >({{ product?.reviewsCount }} avis)</span
          >
        </div>

        <div class="product-state mt-2" *ngIf="product?.state_product">
          <span class="state-badge">{{ product?.state_product }}</span>
        </div>

        <div class="add-to-cart mt-3" *ngIf="!product?.sold_out; else disabledState">
          <a class="btn btn-fill-out btn-radius" (click)="onAddToCart()">
            <mat-icon class="!text-base align-[-2px]">add_shopping_cart</mat-icon>
            <span>Ajouter au panier</span>
          </a>
        </div>
        <ng-template #disabledState>
          <div class="add-to-cart disabled">
            <a class="btn btn-fill-out btn-radius btn-disabled">
              <mat-icon class="!text-base align-[-2px]">remove_shopping_cart</mat-icon>
              <span>Indisponible</span>
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .product_box {
        border: 1px solid #e5e7eb;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        transition:
          box-shadow 0.2s ease,
          transform 0.2s ease;
        border-radius: 0.75rem;
      }
      .product_box:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        transform: translateY(-2px);
      }
      .product_box.watermark::after {
        content: 'RUPTURE';
        position: absolute;
        top: 16px;
        left: -20px;
        transform: rotate(-20deg);
        color: rgba(17, 24, 39, 0.15);
        font-weight: 800;
        font-size: 28px;
        letter-spacing: 2px;
        pointer-events: none;
      }
      .sold-out-badge,
      .discount-badge {
        position: absolute;
        top: 10px;
        z-index: 2;
      }
      .sold-out-badge {
        left: 10px;
        background: #111827;
        color: #fff;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
      }
      .discount-badge {
        right: 10px;
        background: #d65050;
        color: #fff;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
      }
      .product_img .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0));
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .product_img:hover .image-overlay {
        opacity: 1;
      }
      .product_action_box {
        position: absolute;
        bottom: 8px;
        right: 8px;
        z-index: 3;
      }
      .pr_action_btn {
        display: flex;
        gap: 8px;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .pr_action_btn .action-item a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.9);
        color: #374151;
        border: 1px solid #e5e7eb;
        transition:
          background 0.2s ease,
          color 0.2s ease;
      }
      .pr_action_btn .action-item a:hover {
        background: #111827;
        color: #fff;
      }
      .state-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 9999px;
        background: #e0f2fe;
        color: #0369a1;
        font-size: 12px;
        font-weight: 600;
      }
      .btn.btn-fill-out.btn-radius {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border-radius: 0.75rem;
        background: #0891b2;
        color: white;
        font-weight: 600;
        border: 1px solid transparent;
        transition:
          background 0.2s ease,
          transform 0.2s ease;
        cursor: pointer;
        text-decoration: none;
      }
      .btn.btn-fill-out.btn-radius:hover {
        background: #0e7490;
        transform: translateY(-1px);
      }
      .btn.btn-disabled {
        background: #e5e7eb;
        color: #6b7280;
        cursor: not-allowed;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCartItemComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  get productId(): string | number | null {
    return this.product?.id ?? this.product?._id ?? null;
  }

  getTitle(p: any): string {
    return p?.title || p?.name || 'Produit';
  }

  getImage(p: any): string {
    const img = p?.images?.[0];
    if (typeof img === 'string') {
      return img;
    }
    if (img?.image_resize) {
      return img.image_resize;
    }
    return 'https://via.placeholder.com/480x320?text=Product';
  }

  priceTTC(p: any): number {
    const price = Number(p?.price || 0);
    const tva = Number(p?.pourcentages_tva || 0);
    return price + price * tva;
  }

  getQueryParams(): Record<string, any> {
    return {};
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
