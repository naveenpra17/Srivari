import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  input,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { HeroSlide } from '../../../../models';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeadlineLine {
  text?: string;
  accent?: string;
}

interface IndustrialHeroSlide {
  id: number;
  headlineLines: HeadlineLine[];
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  slides = input<HeroSlide[]>([]);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swiperContainer = viewChild<ElementRef<HTMLElement>>('heroSwiper');
  private swiper?: Swiper;

  readonly displaySlides = computed(() => {
    const api = this.slides();
    if (api.length > 0) {
      return api.map((s, i) => this.mapApiSlide(s, i));
    }
    return DEFAULT_INDUSTRIAL_SLIDES;
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.swiperContainer()?.nativeElement;
    if (!el) return;

    this.swiper = new Swiper(el, {
      modules: [Autoplay, EffectFade, Navigation, Pagination],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.hero-nav-next',
        prevEl: '.hero-nav-prev'
      }
    });
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
  }

  isExternal(link: string): boolean {
    return /^https?:\/\//i.test(link);
  }

  routePath(link: string): string {
    if (this.isExternal(link)) return '/';
    const [path] = link.split('#');
    return path || '/';
  }

  routeFragment(link: string): string | undefined {
    if (this.isExternal(link)) return undefined;
    const hash = link.includes('#') ? link.split('#')[1] : '';
    return hash || undefined;
  }

  private mapApiSlide(slide: HeroSlide, index: number): IndustrialHeroSlide {
    const fallback = DEFAULT_INDUSTRIAL_SLIDES[index % DEFAULT_INDUSTRIAL_SLIDES.length];
    const words = (slide.title || '').split(/\s+/).filter(Boolean);
    const headlineLines: HeadlineLine[] = words.length >= 3
      ? [
          { text: words[0] },
          { text: words[1] },
          { text: words.slice(2, -1).join(' '), accent: words[words.length - 1] }
        ]
      : fallback.headlineLines;

    return {
      id: slide.id,
      headlineLines,
      description: slide.description || slide.subtitle || fallback.description,
      imageUrl: slide.imageUrl || fallback.imageUrl,
      ctaText: slide.ctaText || 'Explore Products',
      ctaLink: slide.ctaLink || '/products',
      secondaryCtaText: slide.secondaryCtaText || 'Watch Video',
      secondaryCtaLink: slide.secondaryCtaLink || slide.videoUrl || '#gallery'
    };
  }
}

const DEFAULT_INDUSTRIAL_SLIDES: IndustrialHeroSlide[] = [
  {
    id: 1,
    headlineLines: [
      { text: 'Where' },
      { text: 'Innovation' },
      { text: 'Meets ', accent: 'Reliability' }
    ],
    description: 'Premium pumps, motors & pipes engineered for industrial excellence, built for tomorrow.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80',
    ctaText: 'Explore Products',
    ctaLink: '/products',
    secondaryCtaText: 'Watch Video',
    secondaryCtaLink: '#gallery'
  },
  {
    id: 2,
    headlineLines: [
      { text: 'High-Performance' },
      { text: 'Industrial' },
      { accent: 'Motors' }
    ],
    description: 'Precision-engineered motors delivering unmatched efficiency for demanding manufacturing environments.',
    imageUrl: 'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=900&q=80',
    ctaText: 'View Motors',
    ctaLink: '/products',
    secondaryCtaText: 'Get Quote',
    secondaryCtaLink: '/#contact'
  },
  {
    id: 3,
    headlineLines: [
      { text: 'Heavy-Duty' },
      { text: 'Industrial' },
      { accent: 'Pumps' }
    ],
    description: 'Robust centrifugal and submersible pumps built for continuous operation in critical applications.',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=80',
    ctaText: 'View Pumps',
    ctaLink: '/products',
    secondaryCtaText: 'Watch Video',
    secondaryCtaLink: '#gallery'
  },
  {
    id: 4,
    headlineLines: [
      { text: 'Durable' },
      { text: 'Industrial' },
      { text: 'Pipes & ', accent: 'Valves' }
    ],
    description: 'Corrosion-resistant piping systems and precision valves for oil, gas, water and chemical industries.',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80',
    ctaText: 'Browse Catalog',
    ctaLink: '/products',
    secondaryCtaText: 'Contact Us',
    secondaryCtaLink: '/#contact'
  }
];
