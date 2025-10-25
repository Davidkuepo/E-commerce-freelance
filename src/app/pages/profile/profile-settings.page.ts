import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
