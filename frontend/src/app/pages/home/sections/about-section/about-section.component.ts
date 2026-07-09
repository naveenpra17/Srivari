import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettings } from '../../../../models';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section about-section" id="about">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="about-image">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600" alt="About Motors Industries" loading="lazy">
              <div class="experience-badge">
                <span class="years">{{ settings()['years_experience'] || '25' }}+</span>
                <span class="text">Years of Excellence</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <span class="section-badge">About Us</span>
            <h2 class="section-title">Leading Industrial Motor Manufacturer</h2>
            <div class="about-tabs">
              <div class="about-item">
                <h4>Our Mission</h4>
                <p>{{ settings()['about_mission'] }}</p>
              </div>
              <div class="about-item">
                <h4>Our Vision</h4>
                <p>{{ settings()['about_vision'] }}</p>
              </div>
              <div class="about-item">
                <h4>Our History</h4>
                <p>{{ settings()['about_history'] }}</p>
              </div>
              <div class="about-item achievements">
                <h4>Achievements</h4>
                <p>{{ settings()['about_achievements'] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-image {
      position: relative;
      img { border-radius: var(--border-radius); box-shadow: var(--shadow-lg); width: 100%; }
      .experience-badge {
        position: absolute; bottom: -20px; right: 20px;
        background: var(--secondary); color: white;
        padding: 1.5rem; border-radius: var(--border-radius);
        text-align: center; box-shadow: var(--shadow-md);
        .years { display: block; font-size: 2rem; font-weight: 800; line-height: 1; }
        .text { font-size: 0.8rem; font-weight: 500; }
      }
    }
    .section-badge {
      display: inline-block; color: var(--secondary); font-weight: 600;
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;
    }
    .about-item {
      margin-bottom: 1.5rem;
      h4 { color: var(--primary); font-size: 1rem; margin-bottom: 0.5rem; }
      p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin: 0; }
      &.achievements p { color: var(--secondary); font-weight: 500; }
    }
  `]
})
export class AboutSectionComponent {
  settings = input<SiteSettings>({});
}
