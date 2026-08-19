import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FloatingActionsComponent } from '../../shared/components/floating-actions/floating-actions.component';
import { PublicService } from '../../core/services/public.service';
import { SiteSettings } from '../../models';
import { routeSlideFade } from '../../shared/animations/route-animations';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FloatingActionsComponent],
  animations: [routeSlideFade],
  template: `
    <div class="reading-progress" [style.transform]="'scaleX(' + scrollProgress() + ')'" aria-hidden="true"></div>
    <app-header />
    <main class="public-main">
      <div class="route-wrapper" [@routeSlideFade]="routeAnimation()">
        <router-outlet #o="outlet" (activate)="onActivate($event, o)" />
      </div>
      <app-floating-actions />
    </main>
    <app-footer [settings]="settings()" />
  `,
  styles: [`
    .public-main {
      min-height: 60vh;
      overflow-x: hidden;
    }
    .reading-progress {
      position: fixed; inset: 0 0 auto; z-index: 1100; height: 3px;
      transform-origin: left; background: linear-gradient(90deg, var(--secondary), #ffb36e, var(--secondary));
      box-shadow: 0 1px 12px rgba(255, 107, 0, .7); transition: transform .08s linear;
    }
    .route-wrapper {
      position: relative;
    }
    .route-wrapper > * {
      display: block;
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly router = inject(ActivatedRoute);
  settings = signal<SiteSettings>({});
  routeAnimation = signal('');
  scrollProgress = signal(0);

  ngOnInit(): void {
    this.publicService.getSettings().subscribe({
      next: (res) => this.settings.set(res.data),
      error: () => {}
    });
  }

  onActivate(component: unknown, outlet: RouterOutlet): void {
    const routeData = outlet.activatedRouteData;
    this.routeAnimation.set(routeData?.['animation'] || '');
  }

  @HostListener('window:scroll')
  updateScrollProgress(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  }
}
