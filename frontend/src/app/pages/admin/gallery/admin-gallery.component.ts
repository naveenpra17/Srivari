import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { GalleryItem } from '../../../models';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-gallery.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminGalleryComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  items = signal<GalleryItem[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    imageUrl: ['', Validators.required],
    category: [''],
    sortOrder: [0],
    active: [true]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getGallery().subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void { this.editingId.set(null); this.form.reset({ active: true, sortOrder: 0 }); this.showModal.set(true); }
  openEdit(item: GalleryItem): void { this.editingId.set(item.id); this.form.patchValue(item); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const data = this.form.value as Partial<GalleryItem>;
    const req = id ? this.admin.updateGalleryItem(id, data) : this.admin.createGalleryItem(data);
    req.subscribe({
      next: () => { this.snackbar.success('Saved'); this.closeModal(); this.load(); this.saving.set(false); },
      error: () => { this.snackbar.error('Failed'); this.saving.set(false); }
    });
  }

  deleteItem(item: GalleryItem): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.admin.deleteGalleryItem(item.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.load(); },
      error: () => this.snackbar.error('Failed')
    });
  }
}
