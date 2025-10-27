export default function ProductItem() {
    return (
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

    );
}