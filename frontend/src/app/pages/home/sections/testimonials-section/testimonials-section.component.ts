import { Component, input, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestimonialCardComponent } from '../../../../shared/components/testimonial-card/testimonial-card.component';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { Testimonial } from '../../../../models';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, RouterLink, TestimonialCardComponent],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss'
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly testimonialService = inject(TestimonialService);
  private intervalId?: ReturnType<typeof setInterval>;

  testimonials = input<Testimonial[]>([]);
  featured = signal<Testimonial[]>([]);
  currentIndex = signal(0);

  ngOnInit(): void {
    const items = this.testimonials();
    this.featured.set(items.filter(t => t.featured).length > 0
      ? items.filter(t => t.featured).slice(0, 6)
      : items.slice(0, 6));

    if (isPlatformBrowser(this.platformId) && this.featured().length > 1) {
      this.intervalId = setInterval(() => this.next(), 6000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  visibleCards(): Testimonial[] {
    const items = this.featured();
    if (items.length <= 3) return items;
    const idx = this.currentIndex();
    const result: Testimonial[] = [];
    for (let i = 0; i < Math.min(3, items.length); i++) {
      result.push(items[(idx + i) % items.length]);
    }
    return result;
  }

  next(): void {
    const len = this.featured().length;
    if (len > 0) this.currentIndex.update(i => (i + 1) % len);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  onLike(testimonial: Testimonial): void {
    this.testimonialService.like(testimonial.id).subscribe({
      next: (res) => {
        const updated = res.data;
        this.featured.update(list => list.map(t => t.id === updated.id ? updated : t));
      }
    });
  }
}
