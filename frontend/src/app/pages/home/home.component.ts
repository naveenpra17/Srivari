import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { CategoriesSectionComponent } from './sections/categories-section/categories-section.component';
import { StatsSectionComponent } from './sections/stats-section/stats-section.component';
import { IndustriesSectionComponent } from './sections/industries-section/industries-section.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';
import { GallerySectionComponent } from './sections/gallery-section/gallery-section.component';
import { TestimonialsSectionComponent } from './sections/testimonials-section/testimonials-section.component';
import { ContactSectionComponent } from './sections/contact-section/contact-section.component';
import { PublicService } from '../../core/services/public.service';
import { SeoService } from '../../core/services/seo.service';
import { HomePageData } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    CategoriesSectionComponent,
    StatsSectionComponent,
    AboutSectionComponent,
    IndustriesSectionComponent,
    TestimonialsSectionComponent,
    GallerySectionComponent,
    ContactSectionComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly seo = inject(SeoService);
  data = signal<HomePageData | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.seo.update({
      title: undefined,
      description: 'Premium industrial motors, pumps, pipes and accessories. Trusted by 1500+ clients in 50+ countries.',
      keywords: 'industrial motors, pumps, pipes, manufacturing, motors industries, engineering'
    });

    this.loadHomeData();
  }

  retry(): void {
    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.publicService.getHomePageData().subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.data.set(null);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
