import { Component, OnDestroy, OnInit, inject, signal, computed, HostListener, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService, QuoteService } from '../../core/services/product.service';
import { SnackbarService } from '../../core/services/ui.service';
import { SeoService } from '../../core/services/seo.service';
import { ChatWidgetService } from '../../core/chat/chat-widget.service';
import { Product, ProductImage } from '../../models';
import { RevealDirective } from '../../shared/directives/reveal.directive';

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RevealDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly quoteService = inject(QuoteService);
  private readonly snackbar = inject(SnackbarService);
  private readonly seo = inject(SeoService);
  private readonly chat = inject(ChatWidgetService);
  private readonly fb = inject(FormBuilder);
  private readonly el = inject(ElementRef);
  private readonly lightboxContainer = viewChild<ElementRef<HTMLElement>>('lightboxContainer');
  private readonly lightboxCloseButton = viewChild<ElementRef<HTMLButtonElement>>('lightboxCloseButton');
  private previouslyFocusedElement: HTMLElement | null = null;

  // Lightbox state
  lightboxOpen = signal(false);
  lightboxIndex = signal(0);
  lightboxTransform = signal({ scale: 1, x: 0, y: 0 });
  isDragging = signal(false);
  dragStart = signal({ x: 0, y: 0 });

  // Touch/swipe support
  touchStartX = signal(0);
  touchStartY = signal(0);

  // Form state
  product = signal<Product | null>(null);
  loading = signal(true);
  loadError = signal(false);
  quoteSubmitting = signal(false);
  showQuoteForm = signal(false);
  selectedImageIndex = signal(0);
  formSubmitted = signal(false);
  formErrors = signal<Record<string, string>>({});

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

  lightboxImage = computed(() => {
    const images = this.galleryImages();
    const idx = this.lightboxIndex();
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
        error: () => {
          this.loadError.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }

    this.route.fragment.subscribe(fragment => {
      if (fragment === 'quote') {
        this.openQuoteForm();
      }
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  // Keyboard navigation for lightbox and thumbnails
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (this.lightboxOpen()) {
      if (event.key === 'Tab') {
        this.trapFocus(event);
        return;
      }
      switch (event.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.prevLightboxImage();
          break;
        case 'ArrowRight':
          this.nextLightboxImage();
          break;
      }
    } else if (this.galleryImages().length > 1) {
      // Thumbnail keyboard navigation when focused
      const activeEl = document.activeElement;
      if (activeEl?.classList.contains('thumbnail')) {
        const index = Array.from(activeEl.parentElement?.children || []).indexOf(activeEl);
        if (event.key === 'ArrowRight' && index < this.galleryImages().length - 1) {
          event.preventDefault();
          this.selectImage(index + 1);
          this.focusThumbnail(index + 1);
        } else if (event.key === 'ArrowLeft' && index > 0) {
          event.preventDefault();
          this.selectImage(index - 1);
          this.focusThumbnail(index - 1);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.openLightbox(index);
        }
      }
    }
  }

  // Touch/swipe support for lightbox
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX.set(touch.clientX);
    this.touchStartY.set(touch.clientY);
    if (this.lightboxTransform().scale > 1) {
      const transform = this.lightboxTransform();
      this.dragStart.set({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
    }
  }

  onTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const diffX = this.touchStartX() - endX;
    const diffY = this.touchStartY() - endY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.nextLightboxImage();
      } else {
        this.prevLightboxImage();
      }
    }
  }

  // Lightbox methods
  openLightbox(index: number): void {
    this.previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    this.lightboxTransform.set({ scale: 1, x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.lightboxCloseButton()?.nativeElement.focus());
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.lightboxTransform.set({ scale: 1, x: 0, y: 0 });
    document.body.style.overflow = '';
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }

  prevLightboxImage(): void {
    const images = this.galleryImages();
    if (images.length <= 1) return;
    const newIndex = (this.lightboxIndex() - 1 + images.length) % images.length;
    this.lightboxIndex.set(newIndex);
    this.lightboxTransform.set({ scale: 1, x: 0, y: 0 });
  }

  nextLightboxImage(): void {
    const images = this.galleryImages();
    if (images.length <= 1) return;
    const newIndex = (this.lightboxIndex() + 1) % images.length;
    this.lightboxIndex.set(newIndex);
    this.lightboxTransform.set({ scale: 1, x: 0, y: 0 });
  }

  // Zoom/pan functionality
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const current = this.lightboxTransform();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(current.scale + delta, 1), 4);
    this.lightboxTransform.set({ ...current, scale: newScale });
  }

  onMouseDown(event: MouseEvent): void {
    if (this.lightboxTransform().scale <= 1) return;
    this.isDragging.set(true);
    this.dragStart.set({ x: event.clientX - this.lightboxTransform().x, y: event.clientY - this.lightboxTransform().y });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    const start = this.dragStart();
    this.lightboxTransform.update(t => ({
      ...t,
      x: event.clientX - start.x,
      y: event.clientY - start.y
    }));
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging.set(false);
  }

  onTouchMove(event: TouchEvent): void {
    if (this.lightboxTransform().scale <= 1) return;
    event.preventDefault();
    const touch = event.touches[0];
    const start = this.dragStart();
    this.lightboxTransform.update(t => ({
      ...t,
      x: touch.clientX - start.x,
      y: touch.clientY - start.y
    }));
  }

  onDoubleClick(): void {
    const current = this.lightboxTransform();
    this.lightboxTransform.set({
      ...current,
      scale: current.scale > 1 ? 1 : 2,
      x: 0,
      y: 0
    });
  }

  // Thumbnail methods
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  focusThumbnail(index: number): void {
    const thumbnails = this.el.nativeElement.querySelectorAll('.thumbnail');
    if (thumbnails[index]) {
      (thumbnails[index] as HTMLElement).focus();
    }
  }

  // Form methods
  toggleQuoteForm(): void {
    this.showQuoteForm.update(v => !v);
    if (this.showQuoteForm()) {
      this.scrollToQuoteForm();
    } else {
      this.formSubmitted.set(false);
      this.formErrors.set({});
      this.quoteForm.reset({ quantity: 1 });
    }
  }

  openQuoteForm(): void {
    this.showQuoteForm.set(true);
    this.scrollToQuoteForm();
  }

  private trapFocus(event: KeyboardEvent): void {
    const container = this.lightboxContainer()?.nativeElement;
    if (!container) return;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(element => !element.hasAttribute('disabled'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private scrollToQuoteForm(): void {
    setTimeout(() => {
      document.getElementById('product-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  validateForm(): boolean {
    const errors: Record<string, string> = {};
    const controls = this.quoteForm.controls;

    if (controls.name.invalid && (controls.name.touched || this.formSubmitted())) {
      errors['name'] = 'Name is required';
    }
    if (controls.email.invalid && (controls.email.touched || this.formSubmitted())) {
      errors['email'] = controls.email.errors?.['email'] ? 'Invalid email format' : 'Email is required';
    }
    if (controls.quantity.invalid && (controls.quantity.touched || this.formSubmitted())) {
      errors['quantity'] = 'Quantity must be at least 1';
    }

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  submitQuote(): void {
    this.formSubmitted.set(true);
    if (!this.validateForm()) return;

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
        this.formSubmitted.set(false);
        this.formErrors.set({});
        this.quoteSubmitting.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to submit quote request. Please try again.');
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
    this.chat.setPageContext({
      type: 'product',
      productName: product.name,
      productSlug: product.slug,
      categoryName: product.categoryName
    });
    this.seo.update({
      title: product.name,
      description: product.shortDescription ?? `Explore ${product.name} from Sri Vaari Traders`,
      keywords: `${product.name}, ${product.categoryName ?? 'industrial'}, motors, pumps`,
      image: product.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
      type: 'product'
    });
  }
}
