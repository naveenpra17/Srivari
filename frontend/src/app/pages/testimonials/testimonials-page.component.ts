import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
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
export class TestimonialsPageComponent implements OnInit, OnDestroy {
  private readonly testimonialService = inject(TestimonialService);
  private readonly seo = inject(SeoService);

  featured = signal<Testimonial[]>([]);
  testimonials = signal<Testimonial[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  error = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  totalItems = signal(0);

  searchQuery = '';
  selectedCategory = 'all';
  selectedRating = 0;
  sortBy: 'latest' | 'oldest' | 'popular' = 'latest';
  private searchTimeout?: ReturnType<typeof setTimeout>;
  private filterTimeout?: ReturnType<typeof setTimeout>;

  // Computed values for better UX
  hasResults = computed(() => this.testimonials().length > 0);
  showingResults = computed(() => 
    this.currentPage() * 9 + Math.min(9, this.testimonials().length)
  );
  startIndex = computed(() => this.currentPage() * 9 + 1);

  ngOnInit(): void {
    this.seo.update({
      title: 'Customer Testimonials',
      description: 'Read real stories from industry leaders who trust Sri Vaari Traders for premium industrial solutions.',
      keywords: 'testimonials, reviews, customer stories, motors industries'
    });
    this.loadFeatured();
    this.loadCategories();
    this.loadTestimonials();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
    clearTimeout(this.filterTimeout);
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

  loadTestimonials(append = false): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }

    if (!append) this.error.set(false);
    this.testimonialService.search({
      page: this.currentPage(),
      size: 9,
      q: this.searchQuery,
      category: this.selectedCategory === 'all' ? '' : this.selectedCategory,
      rating: this.selectedRating || undefined,
      sort: this.sortBy
    }).subscribe({
      next: (res) => {
        if (append) {
          this.testimonials.update(list => [...list, ...res.data.content]);
        } else {
          this.testimonials.set(res.data.content);
        }
        this.totalPages.set(res.data.totalPages);
        this.totalItems.set(res.data.totalElements);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        if (!append) this.testimonials.set([]);
        this.error.set(true);
        this.loading.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(0);
      this.loadTestimonials();
    }, 300);
  }

  onFilterChange(): void {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.currentPage.set(0);
      this.loadTestimonials();
    }, 150);
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

  loadMore(): void {
    if (this.currentPage() < this.totalPages() - 1 && !this.loadingMore()) {
      this.currentPage.update(p => p + 1);
      this.loadTestimonials(true);
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedRating = 0;
    this.sortBy = 'latest';
    this.currentPage.set(0);
    this.loadTestimonials();
  }

  hasActiveFilters(): boolean {
    return this.searchQuery !== '' || 
           this.selectedCategory !== 'all' || 
           this.selectedRating !== 0 || 
           this.sortBy !== 'latest';
  }
}
