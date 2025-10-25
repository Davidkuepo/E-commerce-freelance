import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

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
