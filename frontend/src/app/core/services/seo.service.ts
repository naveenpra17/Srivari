import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly siteName = environment.appName;
  private readonly defaultDescription = 'Premium industrial motors, pumps, pipes and accessories engineered for performance. Trusted by 1500+ clients in 50+ countries.';
  private readonly defaultImage = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200';

  update(config: SeoConfig): void {
    const pageTitle = config.title
      ? `${config.title} | ${this.siteName}`
      : `${this.siteName} - ${environment.tagline}`;

    this.title.setTitle(pageTitle);
    this.updateTag('name', 'description', config.description ?? this.defaultDescription);
    this.updateTag('name', 'keywords', config.keywords ?? 'industrial motors, pumps, pipes, manufacturing');
    this.updateTag('property', 'og:title', pageTitle);
    this.updateTag('property', 'og:description', config.description ?? this.defaultDescription);
    this.updateTag('property', 'og:type', config.type ?? 'website');
    this.updateTag('property', 'og:image', config.image ?? this.defaultImage);
    this.updateTag('name', 'twitter:card', 'summary_large_image');
    this.updateTag('name', 'twitter:title', pageTitle);
    this.updateTag('name', 'twitter:description', config.description ?? this.defaultDescription);

    if (config.url && isPlatformBrowser(this.platformId)) {
      this.updateTag('property', 'og:url', config.url);
    } else if (isPlatformBrowser(this.platformId)) {
      this.setCanonicalUrl(window.location.href);
    }
  }

  setCanonicalUrl(url: string): void {
    this.updateTag('property', 'og:url', url);
  }

  private updateTag(attr: string, name: string, content: string): void {
    const selector = attr === 'name' ? `name="${name}"` : `property="${name}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: name, content });
    } else {
      this.meta.addTag({ [attr]: name, content });
    }
  }
}
