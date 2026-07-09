import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { Testimonial } from '../../../models';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminTestimonialsComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  items = signal<Testimonial[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    clientName: ['', Validators.required],
    designation: [''],
    company: [''],
    category: ['General'],
    content: ['', Validators.required],
    fullStory: [''],
    imageUrl: [''],
    videoUrl: [''],
    slug: [''],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    likes: [0],
    sortOrder: [0],
    featured: [false],
    verified: [false],
    active: [true]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getTestimonials().subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ active: true, sortOrder: 0, rating: 5, featured: false, verified: false, likes: 0, category: 'General' });
    this.showModal.set(true);
  }
  openEdit(item: Testimonial): void { this.editingId.set(item.id); this.form.patchValue(item); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const data = this.form.value as Partial<Testimonial>;
    const req = id ? this.admin.updateTestimonial(id, data) : this.admin.createTestimonial(data);
    req.subscribe({
      next: () => { this.snackbar.success('Saved'); this.closeModal(); this.load(); this.saving.set(false); },
      error: () => { this.snackbar.error('Failed'); this.saving.set(false); }
    });
  }

  deleteItem(item: Testimonial): void {
    if (!confirm(`Delete testimonial from "${item.clientName}"?`)) return;
    this.admin.deleteTestimonial(item.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.load(); },
      error: () => this.snackbar.error('Failed')
    });
  }
}
