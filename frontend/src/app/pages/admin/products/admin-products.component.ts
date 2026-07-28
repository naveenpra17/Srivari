import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { Category, Product, ProductImage } from '../../../models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, ImageUploadComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminProductsComponent implements OnInit {
  private readonly admin = inject(AdminService);
  readonly auth = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  productImages = signal<ProductImage[]>([]);
  loading = signal(true);
  saving = signal(false);
  imagesLoading = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);
  newGalleryUrl = signal('');
  newGalleryAlt = signal('');

  form = this.fb.group({
    name: ['', Validators.required],
    categoryId: [null as number | null],
    shortDescription: [''],
    description: [''],
    imageUrl: [''],
    catalogImageUrl: [''],
    brochureUrl: [''],
    price: [null as number | null],
    featured: [false],
    active: [true],
    sortOrder: [0]
  });

  ngOnInit(): void {
    this.loadProducts();
    this.admin.getCategories().subscribe(res => this.categories.set(res.data));
  }

  loadProducts(): void {
    this.loading.set(true);
    this.admin.getProducts(this.currentPage(), 20).subscribe({
      next: (res) => {
        this.products.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.productImages.set([]);
    this.newGalleryUrl.set('');
    this.newGalleryAlt.set('');
    this.form.reset({ featured: false, active: true, sortOrder: 0, catalogImageUrl: '' });
    this.showModal.set(true);
  }

  openEdit(product: Product): void {
    this.editingId.set(product.id);
    this.newGalleryUrl.set('');
    this.newGalleryAlt.set('');
    this.form.patchValue({
      name: product.name,
      categoryId: product.categoryId ?? null,
      shortDescription: product.shortDescription ?? '',
      description: product.description ?? '',
      imageUrl: product.imageUrl ?? '',
      catalogImageUrl: product.catalogImageUrl ?? '',
      brochureUrl: product.brochureUrl ?? '',
      price: product.price ?? null,
      featured: product.featured,
      active: product.active,
      sortOrder: product.sortOrder
    });
    this.loadProductImages(product.id);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.productImages.set([]);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const data = this.form.getRawValue() as Partial<Product>;
    const id = this.editingId();
    const req = id
      ? this.admin.updateProduct(id, data)
      : this.admin.createProduct(data);

    req.subscribe({
      next: (res) => {
        this.snackbar.success(id ? 'Product updated' : 'Product created');
        if (!id && res.data?.id) {
          this.editingId.set(res.data.id);
          this.loadProductImages(res.data.id);
        }
        this.loadProducts();
        this.saving.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to save product');
        this.saving.set(false);
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.admin.deleteProduct(product.id).subscribe({
      next: () => {
        this.snackbar.success('Product deleted');
        this.loadProducts();
      },
      error: () => this.snackbar.error('Failed to delete product')
    });
  }

  loadProductImages(productId: number): void {
    this.imagesLoading.set(true);
    this.admin.getProductImages(productId).subscribe({
      next: (res) => {
        this.productImages.set(res.data);
        this.imagesLoading.set(false);
      },
      error: () => this.imagesLoading.set(false)
    });
  }

  addGalleryImage(): void {
    const productId = this.editingId();
    const imageUrl = this.newGalleryUrl();
    if (!productId || !imageUrl) {
      this.snackbar.error('Upload an image first');
      return;
    }
    this.admin.addProductImage(productId, {
      imageUrl,
      altText: this.newGalleryAlt() || this.form.get('name')?.value || '',
      isPrimary: this.productImages().length === 0
    }).subscribe({
      next: () => {
        this.snackbar.success('Gallery image added');
        this.newGalleryUrl.set('');
        this.newGalleryAlt.set('');
        this.loadProductImages(productId);
        this.loadProducts();
      },
      error: () => this.snackbar.error('Failed to add image')
    });
  }

  setPrimaryImage(image: ProductImage): void {
    const productId = this.editingId();
    if (!productId) return;
    this.admin.setPrimaryProductImage(productId, image.id).subscribe({
      next: () => {
        this.snackbar.success('Primary image updated');
        this.loadProductImages(productId);
        this.loadProducts();
        const primary = image.imageUrl;
        this.form.patchValue({ imageUrl: primary });
      },
      error: () => this.snackbar.error('Failed to set primary image')
    });
  }

  deleteGalleryImage(image: ProductImage): void {
    const productId = this.editingId();
    if (!productId || !confirm('Delete this gallery image?')) return;
    this.admin.deleteProductImage(productId, image.id).subscribe({
      next: () => {
        this.snackbar.success('Image deleted');
        this.loadProductImages(productId);
        this.loadProducts();
      },
      error: () => this.snackbar.error('Failed to delete image')
    });
  }

  onImageDrop(event: CdkDragDrop<ProductImage[]>): void {
    const productId = this.editingId();
    if (!productId) return;

    const images = [...this.productImages()].sort((a, b) => a.sortOrder - b.sortOrder);
    moveItemInArray(images, event.previousIndex, event.currentIndex);

    // Update sortOrder for all affected images
    const updates = images.map((img, index) => ({
      id: img.id,
      sortOrder: index
    }));

    // Send updates to server
    this.saveImageOrder(productId, updates);
  }

  private saveImageOrder(productId: number, updates: { id: number; sortOrder: number }[]): void {
    let completed = 0;
    const total = updates.length;
    let hasError = false;

    updates.forEach(update => {
      this.admin.updateProductImage(productId, update.id, { sortOrder: update.sortOrder }).subscribe({
        next: () => {
          completed++;
          if (completed === total && !hasError) {
            this.snackbar.success('Image order updated');
            this.loadProductImages(productId);
          }
        },
        error: () => {
          if (!hasError) {
            hasError = true;
            this.snackbar.error('Failed to reorder images');
          }
        }
      });
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }
}
