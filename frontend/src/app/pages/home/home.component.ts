import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { ProductsSectionComponent } from './sections/products-section/products-section.component';
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
    ProductsSectionComponent,
    StatsSectionComponent,
    IndustriesSectionComponent,
    AboutSectionComponent,
    GallerySectionComponent,
    TestimonialsSectionComponent,
    ContactSectionComponent
  ],
  template: `
    <app-hero-section [slides]="data()?.heroSlides ?? []" />
    <app-products-section [products]="data()?.featuredProducts ?? []" />
    <app-stats-section [settings]="data()?.settings ?? {}" />
    <app-industries-section [industries]="data()?.industries ?? []" />
    <app-about-section [settings]="data()?.settings ?? {}" />
    <app-gallery-section [items]="data()?.gallery ?? []" />
    <app-testimonials-section [testimonials]="data()?.testimonials ?? []" />
    <app-contact-section [settings]="data()?.settings ?? {}" />
  `
})
export class HomeComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly seo = inject(SeoService);
  data = signal<HomePageData | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: undefined,
      description: 'Premium industrial motors, pumps, pipes and accessories. Trusted by 1500+ clients in 50+ countries.',
      keywords: 'industrial motors, pumps, pipes, manufacturing, motors industries, engineering'
    });

    this.publicService.getHomePageData().subscribe({
      next: (res) => this.data.set(res.data),
      error: () => this.data.set({
        heroSlides: [], featuredProducts: [], categories: [],
        industries: [], testimonials: [], gallery: [], settings: {}
      })
    });
  }
}
