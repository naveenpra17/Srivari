import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FloatingActionsComponent } from '../../shared/components/floating-actions/floating-actions.component';
import { PublicService } from '../../core/services/public.service';
import { SiteSettings } from '../../models';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FloatingActionsComponent],
  template: `
    <app-header />
    <main class="public-main">
      <router-outlet />
    </main>
    <app-footer [settings]="settings()" />
    <app-floating-actions />
  `,
  styles: [`
    .public-main {
      min-height: 60vh;
      overflow-x: hidden;
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  settings = signal<SiteSettings>({});

  ngOnInit(): void {
    this.publicService.getSettings().subscribe({
      next: (res) => this.settings.set(res.data),
      error: () => {}
    });
  }
}
