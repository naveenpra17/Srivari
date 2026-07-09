import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [`:host { display: block; }`]
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly theme = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.seo.setCanonicalUrl(window.location.href);
    });
  }
}
