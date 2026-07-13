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
    <main class="products-page">
      <div class="page-hero">
        <div class="container">
          <h1>Our Products</h1>
          <p>Premium industrial motors, pumps, pipes and accessories</p>
        </div>
      </div>
      <div class="container section">
        <div class="filters mb-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Search products..."
            class="search-input">
        </div>
        <div class="row g-4">
          @for (product of products(); track product.id) {
            <div class="col-lg-3 col-md-6">
              <div class="card-custom product-card">
                <div class="product-image">
                  <img [src]="product.imageUrl || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'" [alt]="product.name" loading="lazy">
                </div>
                <div class="product-body p-3">
                  <h3>{{ product.name }}</h3>
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
        @if (totalPages() > 1) {
          <div class="pagination-controls d-flex justify-content-center gap-2 mt-4">
            <button class="btn-outline-custom" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">Previous</button>
            <span class="align-self-center">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <button class="btn-outline-custom" [disabled]="currentPage() >= totalPages() - 1" (click)="goToPage(currentPage() + 1)">Next</button>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .page-hero {
      background: var(--primary); color: white; padding: 120px 0 60px; text-align: center;
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
      p { opacity: 0.8; font-size: 1.1rem; }
    }
    .search-input {
      width: 100%; max-width: 100%; padding: 12px 20px; min-height: 44px;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 50px; font-family: inherit; font-size: 1rem; outline: none;
      &:focus { border-color: var(--primary); }
    }
    .page-hero {
      padding: 100px 0 40px;
      h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); }
      @media (max-width: 768px) { padding: 90px 0 32px; }
    }
    .product-card {
      height: 100%;
      .product-image { height: 200px; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; }
      }
      h3 { font-size: 1.1rem; color: var(--primary); }
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

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadProducts(): void {
    this.productService.getProducts(this.currentPage(), 12, this.searchQuery, this.categoryId).subscribe({
      next: (res) => {
        this.products.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
      },
      error: () => {
        this.products.set([]);
        this.totalPages.set(0);
      }
    });
  }
}