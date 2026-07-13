import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService, QuoteService } from '../../core/services/product.service';
import { SnackbarService } from '../../core/services/ui.service';
import { SeoService } from '../../core/services/seo.service';
import { ChatWidgetService } from '../../core/chat/chat-widget.service';
import { Product, ProductImage } from '../../models';

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly quoteService = inject(QuoteService);
  private readonly snackbar = inject(SnackbarService);
  private readonly seo = inject(SeoService);
  private readonly chat = inject(ChatWidgetService);
  private readonly fb = inject(FormBuilder);

  product = signal<Product | null>(null);
  loading = signal(true);
  quoteSubmitting = signal(false);
  showQuoteForm = signal(false);
  selectedImageIndex = signal(0);

  galleryImages = computed(() => {
    const p = this.product();
    if (!p) return [] as ProductImage[];
    if (p.images && p.images.length > 0) return p.images;
    if (p.imageUrl) {
      return [{ id: 0, imageUrl: p.imageUrl, altText: p.name, sortOrder: 0, isPrimary: true }];
    }
    return [{ id: 0, imageUrl: FALLBACK_PRODUCT_IMAGE, altText: p.name, sortOrder: 0, isPrimary: true }];
  });

  selectedImage = computed(() => {
    const images = this.galleryImages();
    const idx = this.selectedImageIndex();
    return images[idx] ?? images[0];
  });

  quoteForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    quantity: [1, [Validators.required, Validators.min(1)]],
    message: ['']
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.productService.getBySlug(slug).subscribe({
        next: (res) => {
          this.product.set(res.data);
          this.loading.set(false);
          this.updateSeo(res.data);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleQuoteForm(): void {
    this.showQuoteForm.update(v => !v);
  }

  submitQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }
    const p = this.product();
    if (!p) return;

    this.quoteSubmitting.set(true);
    this.quoteService.submit({
      productId: p.id,
      ...this.quoteForm.value as any
    }).subscribe({
      next: () => {
        this.snackbar.success('Quote request submitted! We will contact you shortly.');
        this.quoteForm.reset({ quantity: 1 });
        this.showQuoteForm.set(false);
        this.quoteSubmitting.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to submit quote request');
        this.quoteSubmitting.set(false);
      }
    });
  }

  downloadBrochure(): void {
    const url = this.product()?.brochureUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      this.snackbar.error('Brochure not available for this product');
    }
  }

  specEntries(product: Product): { key: string; value: string }[] {
    if (!product.specifications) return [];
    return Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
  }

  private updateSeo(product: Product): void {
    this.chat.setPageContext({ type: 'product', productName: product.name });
    this.seo.update({
      title: product.name,
      description: product.shortDescription ?? `Explore ${product.name} from Sri Vaari Traders`,
      keywords: `${product.name}, ${product.categoryName ?? 'industrial'}, motors, pumps`,
      image: product.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
      type: 'product'
    });
  }
}
