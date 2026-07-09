import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { PageResponse, Testimonial } from '../../models';

export interface TestimonialSearchParams {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
  rating?: number;
  sort?: 'latest' | 'oldest' | 'popular';
}

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly api = inject(ApiService);

  getAll() {
    return this.api.get<Testimonial[]>('/testimonials');
  }

  getFeatured() {
    return this.api.get<Testimonial[]>('/testimonials/featured');
  }

  getCategories() {
    return this.api.get<string[]>('/testimonials/categories');
  }

  search(params: TestimonialSearchParams = {}) {
    return this.api.get<PageResponse<Testimonial>>('/testimonials/search', {
      page: params.page ?? 0,
      size: params.size ?? 9,
      q: params.q ?? '',
      category: params.category ?? '',
      rating: params.rating ?? 0,
      sort: params.sort ?? 'latest'
    });
  }

  getBySlug(slug: string) {
    return this.api.get<Testimonial>(`/testimonials/slug/${slug}`);
  }

  getRelated(slug: string) {
    return this.api.get<Testimonial[]>(`/testimonials/slug/${slug}/related`);
  }

  like(id: number) {
    return this.api.post<Testimonial>(`/testimonials/${id}/like`, {});
  }
}
