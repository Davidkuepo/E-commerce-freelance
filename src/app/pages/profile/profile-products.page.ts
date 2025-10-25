import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
            routerLink="/profile/products/new"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
          >
            <mat-icon class="!text-base">add_box</mat-icon>
            Créer un produit
          </a>
        </div>
        <p class="text-gray-600 mt-3">Liste et gestion des produits (à venir).</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProductsPage {}
