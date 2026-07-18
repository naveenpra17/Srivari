import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <a routerLink="/" class="btn-secondary-custom">Back to Home</a>
    </main>
  `,
  styles: [`
    .not-found {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      h1 { font-size: 6rem; color: var(--primary); line-height: 1; }
      p { color: var(--text-dark); font-size: 1.2rem; margin-bottom: 2rem; }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      keywords: '404, not found'
    });
  }
}
