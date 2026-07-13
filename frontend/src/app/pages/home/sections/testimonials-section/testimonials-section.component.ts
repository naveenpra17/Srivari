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
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Testimonial } from '../../../../models';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss'
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  testimonials = input<Testimonial[]>([]);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swiperContainer = viewChild<ElementRef<HTMLElement>>('testimonialSwiper');
  private swiper?: Swiper;

  readonly items = computed(() => {
    const list = this.testimonials();
    if (list.length > 0) {
      const featured = list.filter(t => t.featured);
      return (featured.length > 0 ? featured : list).slice(0, 8);
    }
    return FALLBACK_TESTIMONIALS;
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || this.items().length <= 1) return;
    const el = this.swiperContainer()?.nativeElement;
    if (!el) return;

    this.swiper = new Swiper(el, {
      modules: [Autoplay, Navigation, Pagination],
      loop: true,
      speed: 700,
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.testimonial-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.testimonial-nav-next',
        prevEl: '.testimonial-nav-prev'
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
  }

  stars(rating: number): number[] {
    return Array.from({ length: Math.min(5, Math.max(0, rating)) });
  }

  formatRole(item: Testimonial): string {
    return [item.designation, item.company].filter(Boolean).join(', ');
  }
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: 'Rajesh Kumar',
    designation: 'Plant Manager',
    company: 'Tata Steel',
    content: 'Sri Vaari Traders delivered exceptional reliability across our production line. Their engineering support and product quality are world-class.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80',
    featured: true,
    sortOrder: 1,
    active: true
  },
  {
    id: 2,
    clientName: 'Sarah Mitchell',
    designation: 'Operations Director',
    company: 'Grundfos Partner',
    content: 'We have partnered with Sri Vaari Traders for over a decade. Their pumps consistently exceed performance benchmarks in demanding environments.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    featured: true,
    sortOrder: 2,
    active: true
  },
  {
    id: 3,
    clientName: 'Ahmed Hassan',
    designation: 'Chief Engineer',
    company: 'ADNOC Supply',
    content: 'From specification to installation, the team demonstrated deep industrial expertise. A trusted supplier for oil & gas applications.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    featured: true,
    sortOrder: 3,
    active: true
  }
];
