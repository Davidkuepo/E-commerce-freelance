import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AppHeader, AppFooter } from './components/layout/components';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.store';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, AppHeader, AppFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('E-commerce-App');
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  showChrome = signal<boolean>(true);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.hydrate());

    try {
      const hidePathsSet = new Set(['/login', '/register', '/forgot-password']);
      const isHidden = (url: string) => {
        const base = (url || '').split('?')[0].split('#')[0];
        return hidePathsSet.has(base);
      };
      this.showChrome.set(!isHidden(this.router.url));
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          this.showChrome.set(!isHidden(ev.urlAfterRedirects));
        }
      });
    } catch {}
  }
}
