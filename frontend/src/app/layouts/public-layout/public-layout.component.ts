import { Component, OnInit, inject, signal } from '@angular/core';
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
}
