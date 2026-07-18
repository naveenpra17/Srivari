import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">About Us</span>
        <h1>Engineering Excellence Since 1999</h1>
        <p>Premium industrial motors, pumps, and solutions trusted by leaders across 50+ countries.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-lg-6">
            <h2>Where Innovation Meets Reliability</h2>
            <p class="lead">Sri Vaari Traders designs and delivers world-class industrial equipment engineered for demanding environments.</p>
            <p>From manufacturing plants to energy facilities, our products power critical operations with unmatched durability and performance.</p>
            <a routerLink="/testimonials" class="btn-primary-custom mt-3">Read Customer Stories</a>
          </div>
          <div class="col-lg-6">
            <div class="about-visual"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      padding: 130px 0 70px;
      background: linear-gradient(135deg, #0A2B5E, #1a4480);
      color: white; text-align: center;
      h1 { color: white; font-size: clamp(2rem, 5vw, 3rem); margin: 0.75rem 0; }
      p { opacity: 0.9; max-width: 600px; margin: 0 auto; }
    }
    .eyebrow {
      display: inline-block; background: rgba(255,107,0,0.2); color: #ffb380;
      padding: 6px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 600;
    }
    h2 { color: var(--primary); margin-bottom: 1rem; }
    .lead { font-size: 1.1rem; color: var(--text-dark); line-height: 1.8; }
    .about-visual {
      height: 320px; border-radius: 18px;
      background: linear-gradient(135deg, rgba(10,43,94,0.1), rgba(255,107,0,0.15));
      box-shadow: 0 16px 48px rgba(10,43,94,0.1);
    }
  `]
})
export class AboutPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  ngOnInit(): void {
    this.seo.update({ title: 'About Us', description: 'Learn about Sri Vaari Traders — engineering excellence since 1999.' });
  }
}
