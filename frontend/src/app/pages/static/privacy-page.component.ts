import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page section">
      <div class="container legal-content">
        <h1>Privacy Policy</h1>
        <p>Last updated: {{ year }}</p>
        <p>Sri Vaari Traders respects your privacy. We collect only information necessary to respond to inquiries and improve our services.</p>
        <h2>Information We Collect</h2>
        <p>Contact form submissions, quote requests, and newsletter sign-ups may include your name, email, phone, and company details.</p>
        <h2>How We Use Data</h2>
        <p>We use your information to respond to requests, provide product information, and improve our website experience.</p>
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
export class PrivacyPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly year = new Date().getFullYear();
  ngOnInit(): void { this.seo.update({ title: 'Privacy Policy' }); }
}
