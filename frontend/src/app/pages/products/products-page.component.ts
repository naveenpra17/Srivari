import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { Product } from '../../models';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="products-page">
      <div class="page-hero">
        <div class="container">
          <h1>Our Products</h1>
          <p>Premium industrial motors, pumps, pipes and accessories</p>
        </div>
      </div>
      <div class="container section">
        <div class="filters mb-4">
          <div class="search-shell">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
            <input type="search" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Search motors, pumps, pipes..." class="search-input" aria-label="Search products">
            @if (searchQuery) { <button type="button" class="clear-search" (click)="clearSearch()" aria-label="Clear product search">×</button> }
          </div>
          @if (!loading() && !error()) { <p class="results-summary">{{ products().length }} product{{ products().length === 1 ? '' : 's' }} shown</p> }
        </div>
        @if (loading()) {
          <p class="text-center py-5" role="status">Loading products…</p>
        } @else if (error()) {
          <div class="text-center py-5" role="alert">
            <p class="text-muted">Products couldn’t be loaded. Please try again.</p>
            <button type="button" class="btn-primary-custom" (click)="loadProducts()">Try again</button>
          </div>
        } @else {
        <div class="row g-4">
          @for (product of products(); track product.id) {
            <div class="col-lg-3 col-md-6">
              <div class="card-custom product-card">
                <div class="product-image">
                  <img [src]="product.imageUrl || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'" [alt]="product.name" loading="lazy">
                </div>
                <div class="product-body p-3">
                  <h2 class="product-name">{{ product.name }}</h2>
                  <p>{{ product.shortDescription }}</p>
                  <div class="product-card-actions">
                    <a [routerLink]="['/products', product.slug]" class="btn-primary-custom btn-sm">View Details</a>
                    <a [routerLink]="['/products', product.slug]" class="btn-outline-custom btn-sm">Request Quote</a>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-12 text-center py-5">
              <p class="text-muted">No products found.</p>
            </div>
          }
        </div>
        }
        @if (totalPages() > 1) {
          <div class="pagination-controls d-flex justify-content-center gap-2 mt-4">
            <button class="btn-outline-custom" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">Previous</button>
            <span class="align-self-center">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <button class="btn-outline-custom" [disabled]="currentPage() >= totalPages() - 1" (click)="goToPage(currentPage() + 1)">Next</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-hero {
      background: #0a2b5e;
      color: #ffffff;
      padding: 120px 0 60px;
      text-align: center;
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #ffffff; }
      p { color: #e2e8f0; font-size: 1.1rem; }
    }
    .search-input {
      width: 100%; max-width: 100%; padding: 12px 44px; min-height: 52px; border: 0;
      background: transparent; font-family: inherit; font-size: 1rem; outline: none;
      &:focus { border-color: var(--primary); }
    }
    .search-shell { display: flex; align-items: center; position: relative; max-width: 720px; margin: 0 auto; border: 1px solid var(--border-color); border-radius: 999px; background: var(--card-bg); box-shadow: 0 12px 28px rgba(10,43,94,.08); }
    .search-shell > svg { position: absolute; left: 18px; color: var(--secondary); }
    .clear-search { position: absolute; right: 10px; width: 34px; height: 34px; border: 0; border-radius: 50%; background: rgba(10,43,94,.08); color: var(--primary); font-size: 1.4rem; line-height: 1; }
    .results-summary { max-width: 720px; margin: .75rem auto 0; color: var(--text-muted); font-size: .86rem; }
    .page-hero {
      padding: 100px 0 40px;
      h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); }
      @media (max-width: 768px) { padding: 90px 0 32px; }
    }
    .product-card {
      height: 100%;
      .product-image { height: 200px; overflow: hidden;
        img { width: 100%;  object-fit: cover; }
      }
      .product-name { font-size: 1.1rem; color: var(--primary); margin: 0; }
      p { font-size: 0.9rem; color: var(--text-muted); }
    }
    .btn-sm { padding: 8px 20px !important; font-size: 0.85rem !important; }
    .product-card-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }
  `]
})
export class ProductsPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  searchQuery = '';
  categoryId?: number;
  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.seo.update({
      title: 'Products',
      description: 'Browse our full range of industrial motors, pumps, pipes and accessories.',
      keywords: 'industrial motors, pumps, pipes, product catalog, motors industries'
    });

    this.route.queryParams.subscribe(params => {
      const categoryParam = params['categoryId'];
      if (categoryParam) {
        this.categoryId = Number(categoryParam);
        this.searchQuery = '';
      } else if (params['search']) {
        this.searchQuery = params['search'];
        this.categoryId = undefined;
      } else {
        this.categoryId = undefined;
      }
      this.currentPage.set(0);
      this.loadProducts();
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.categoryId = undefined;
      this.currentPage.set(0);
      this.loadProducts();
    }, 400);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(false);
    this.productService.getProducts(this.currentPage(), 12, this.searchQuery, this.categoryId).subscribe({
      next: (res) => {
        this.products.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.totalPages.set(0);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
