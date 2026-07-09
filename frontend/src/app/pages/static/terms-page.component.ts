import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page section">
      <div class="container legal-content">
        <h1>Terms of Service</h1>
        <p>Last updated: {{ year }}</p>
        <p>By using the Motors Industries website, you agree to these terms. Product specifications and availability are subject to change.</p>
        <h2>Use of Website</h2>
        <p>Content is provided for informational purposes. Unauthorized reproduction of materials is prohibited.</p>
        <h2>Limitation of Liability</h2>
        <p>Motors Industries is not liable for indirect damages arising from use of this website or its content.</p>
        <a routerLink="/" class="btn-outline-custom mt-4">Back to Home</a>
      </div>
    </section>
  `,
  styles: [`
    .legal-page { padding-top: 120px; }
    .legal-content { max-width: 720px; }
    h1 { color: var(--primary); margin-bottom: 0.5rem; }
    h2 { color: var(--primary); font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
    p { line-height: 1.8; color: var(--text-muted); }
  `]
})
export class TermsPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly year = new Date().getFullYear();
  ngOnInit(): void { this.seo.update({ title: 'Terms of Service' }); }
}
