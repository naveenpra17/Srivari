import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TestimonialService } from '../../core/services/testimonial.service';
import { SeoService } from '../../core/services/seo.service';
import { TestimonialCardComponent } from '../../shared/components/testimonial-card/testimonial-card.component';
import { Testimonial } from '../../models';

@Component({
  selector: 'app-testimonials-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TestimonialCardComponent],
  templateUrl: './testimonials-page.component.html',
  styleUrl: './testimonials-page.component.scss'
})
export class TestimonialsPageComponent implements OnInit {
  private readonly testimonialService = inject(TestimonialService);
  private readonly seo = inject(SeoService);

  featured = signal<Testimonial[]>([]);
  testimonials = signal<Testimonial[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);

  searchQuery = '';
  selectedCategory = 'all';
  selectedRating = 0;
  sortBy: 'latest' | 'oldest' | 'popular' = 'latest';
  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.seo.update({
      title: 'Customer Testimonials',
      description: 'Read real stories from industry leaders who trust Sri Vaari for premium industrial solutions.',
      keywords: 'testimonials, reviews, customer stories, motors industries'
    });
    this.loadFeatured();
    this.loadCategories();
    this.loadTestimonials();
  }

  loadFeatured(): void {
    this.testimonialService.getFeatured().subscribe({
      next: (res) => this.featured.set(res.data.slice(0, 3))
    });
  }

  loadCategories(): void {
    this.testimonialService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data)
    });
  }

  loadTestimonials(): void {
    this.loading.set(true);
    this.testimonialService.search({
      page: this.currentPage(),
      size: 9,
      q: this.searchQuery,
      category: this.selectedCategory === 'all' ? '' : this.selectedCategory,
      rating: this.selectedRating || undefined,
      sort: this.sortBy
    }).subscribe({
      next: (res) => {
        this.testimonials.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(0);
      this.loadTestimonials();
    }, 350);
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadTestimonials();
  }

  onLike(testimonial: Testimonial): void {
    this.testimonialService.like(testimonial.id).subscribe({
      next: (res) => {
        const updated = res.data;
        this.testimonials.update(list =>
          list.map(t => t.id === updated.id ? updated : t));
        this.featured.update(list =>
          list.map(t => t.id === updated.id ? updated : t));
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadTestimonials();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
