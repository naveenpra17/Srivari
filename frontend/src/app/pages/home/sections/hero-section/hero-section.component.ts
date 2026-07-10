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
    const api = this.slides().filter((slide) => !this.isTestimonialSlide(slide));
    if (api.length === 0) {
      return DEFAULT_INDUSTRIAL_SLIDES;
    }

    return api.map((apiSlide, index) => {
      const fallback = DEFAULT_INDUSTRIAL_SLIDES[index] ?? DEFAULT_INDUSTRIAL_SLIDES[0];
      return {
        id: apiSlide.id,
        headlineLines: fallback.headlineLines,
        description: apiSlide.description || apiSlide.subtitle || fallback.description,
        imageUrl: apiSlide.imageUrl || fallback.imageUrl,
        ctaText: apiSlide.ctaText || fallback.ctaText,
        ctaLink: apiSlide.ctaLink || fallback.ctaLink,
        secondaryCtaText: apiSlide.secondaryCtaText || fallback.secondaryCtaText,
        secondaryCtaLink: apiSlide.secondaryCtaLink || apiSlide.videoUrl || fallback.secondaryCtaLink
      };
    });
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Defer init so Angular finishes rendering all @for slides before Swiper measures the DOM.
    requestAnimationFrame(() => this.initSwiper());
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
  }

  private initSwiper(): void {
    const el = this.swiperContainer()?.nativeElement;
    if (!el) return;

    this.swiper?.destroy(true, true);

    this.swiper = new Swiper(el, {
      modules: [Autoplay, EffectFade, Navigation, Pagination],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      slidesPerView: 1,
      // Loop clones DOM nodes; Angular bindings do not carry over to clones (blank slides).
      loop: false,
      rewind: true,
      speed: 800,
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: true
      },
      pagination: {
        el: el.querySelector<HTMLElement>('.hero-pagination'),
        clickable: true
      },
      navigation: {
        nextEl: el.querySelector<HTMLElement>('.hero-nav-next'),
        prevEl: el.querySelector<HTMLElement>('.hero-nav-prev')
      },
      on: {
        init: (swiper) => this.ensureAutoplay(swiper)
      }
    });

    this.refreshSwiperAfterImages(el);
  }

  private ensureAutoplay(swiper: Swiper = this.swiper!): void {
    if (!swiper?.autoplay || this.displaySlides().length <= 1) return;
    if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }

  private refreshSwiperAfterImages(container: HTMLElement): void {
    const images = container.querySelectorAll('img');
    if (images.length === 0) {
      this.swiper?.update();
      this.ensureAutoplay();
      return;
    }

    let pending = images.length;
    const done = () => {
      pending--;
      if (pending === 0) {
        this.swiper?.update();
        this.ensureAutoplay();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
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

  private isTestimonialSlide(slide: HeroSlide): boolean {
    const blob = `${slide.title} ${slide.subtitle ?? ''} ${slide.description ?? ''} ${slide.ctaLink ?? ''} ${slide.secondaryCtaLink ?? ''}`.toLowerCase();
    return blob.includes('/testimonials') || /testimonial|stories|share your story|community trust|every story/.test(blob);
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