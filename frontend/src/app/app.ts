import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { SwUpdateService } from './core/services/sw-update.service';
import { routeSlideFade } from './shared/animations/route-animations';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  animations: [routeSlideFade],
  template: `
    <router-outlet [@routeSlideFade]="o.activatedRouteData['animation'] ?? ''" #o="outlet" />
    <app-toast-container />
  `,
  styles: [`:host { display: block; }`]
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly theme = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swUpdate = inject(SwUpdateService);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Auto-detect and activate Service Worker updates
    this.swUpdate.init();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.seo.setCanonicalUrl(window.location.href);
    });
  }
}
