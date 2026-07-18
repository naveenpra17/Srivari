import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { HeroSlide } from '../../../../models';

interface HeadlineLine {
  text?: string;
  accent?: string;
}

interface DisplaySlide {
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
export class HeroSectionComponent implements OnDestroy {
  slides = input<HeroSlide[]>([]);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swiperContainer = viewChild<ElementRef<HTMLElement>>('heroSwiper');
  private swiper?: Swiper;

  // Animation state signals
  readonly activeSlideIndex = signal(0);
  readonly isAnimating = signal(false);
  readonly slideContentVisible = signal(false);

  readonly displaySlides = computed(() =>
    this.slides()
      .filter((slide) => !this.isTestimonialSlide(slide) && !!slide.imageUrl?.trim())
      .map((slide) => ({
        id: slide.id,
        headlineLines: toHeadlineLines(slide.title, slide.subtitle),
        description: slide.description || slide.subtitle || '',
        imageUrl: slide.imageUrl,
        ctaText: slide.ctaText || 'Explore Products',
        ctaLink: slide.ctaLink || '/products',
        secondaryCtaText: slide.secondaryCtaText || 'Contact Us',
        secondaryCtaLink: slide.secondaryCtaLink || slide.videoUrl || '/#contact'
      }))
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId) || this.displaySlides().length === 0) return;
      requestAnimationFrame(() => this.initSwiper());
    });

    // Effect to trigger content animation when slide changes
    effect(() => {
      const index = this.activeSlideIndex();
      if (index >= 0 && this.displaySlides().length > 0) {
        this.triggerContentAnimation();
      }
    });
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
      autoHeight: false,
      slidesPerView: 1,
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
        init: (swiper) => {
          this.ensureAutoplay(swiper);
          this.activeSlideIndex.set(swiper.realIndex);
          this.triggerContentAnimation();
        },
        slideChangeTransitionStart: (swiper) => {
          this.isAnimating.set(true);
          this.slideContentVisible.set(false);
        },
        slideChangeTransitionEnd: (swiper) => {
          this.activeSlideIndex.set(swiper.realIndex);
          this.isAnimating.set(false);
          this.triggerContentAnimation();
        }
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

  private triggerContentAnimation(): void {
    // Reset and trigger animation
    this.slideContentVisible.set(false);
    requestAnimationFrame(() => {
      this.slideContentVisible.set(true);
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

  // Track by function for ngFor performance
  trackBySlideId(index: number, slide: DisplaySlide): string {
    return String(slide.id);
  }

  trackByLineIndex(index: number, line: HeadlineLine): number {
    return index;
  }
}

function toHeadlineLines(title: string, subtitle?: string): HeadlineLine[] {
  const trimmed = title.trim();
  if (!trimmed) {
    return subtitle ? [{ accent: subtitle }] : [{ text: 'Welcome' }];
  }
  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    return subtitle ? [{ text: trimmed }, { accent: subtitle }] : [{ text: trimmed }];
  }
  const accent = words.pop()!;
  return [{ text: `${words.join(' ')} ` }, { accent }];
}