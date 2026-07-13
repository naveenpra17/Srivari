import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ContactForm, PageResponse, Product, QuoteRequest } from '../../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  getFeatured() {
    return this.api.get<Product[]>('/products/featured');
  }

  getProducts(page = 0, size = 12, search?: string, categoryId?: number) {
    const params: Record<string, string | number | boolean> = { page, size };
    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      params['search'] = trimmedSearch;
    }
    if (categoryId != null) {
      params['categoryId'] = categoryId;
    }
    return this.api.get<PageResponse<Product>>('/products', params);
  }

  getBySlug(slug: string) {
    return this.api.get<Product>(`/products/${slug}`);
  }
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly api = inject(ApiService);

  submit(quote: QuoteRequest) {
    return this.api.post<QuoteRequest>('/quotes', quote);
  }
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly api = inject(ApiService);

  submit(form: ContactForm) {
    return this.api.post<unknown>('/contact', form);
  }
}
