import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
