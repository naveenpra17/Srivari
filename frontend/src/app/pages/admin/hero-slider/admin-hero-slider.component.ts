import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { HeroSlide } from '../../../models';

@Component({
  selector: 'app-admin-hero-slider',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-hero-slider.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminHeroSliderComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  items = signal<HeroSlide[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    description: [''],
    imageUrl: ['', Validators.required],
    videoUrl: [''],
    ctaText: [''],
    ctaLink: [''],
    secondaryCtaText: [''],
    secondaryCtaLink: [''],
    sortOrder: [0],
    active: [true],
    publishAt: ['']
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getHeroSlides().subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void { this.editingId.set(null); this.form.reset({ active: true, sortOrder: 0, publishAt: '' }); this.showModal.set(true); }
  openEdit(item: HeroSlide): void {
    this.editingId.set(item.id);
    this.form.patchValue({
      ...item,
      publishAt: item.publishAt ? item.publishAt.slice(0, 16) : ''
    });
    this.showModal.set(true);
  }
  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const raw = this.form.value as Partial<HeroSlide> & { publishAt?: string };
    const data: Partial<HeroSlide> = { ...raw };
    if (raw.publishAt) {
      data.publishAt = new Date(raw.publishAt).toISOString();
    } else {
      data.publishAt = undefined;
    }
    const req = id ? this.admin.updateHeroSlide(id, data) : this.admin.createHeroSlide(data);
    req.subscribe({
      next: () => { this.snackbar.success('Saved'); this.closeModal(); this.load(); this.saving.set(false); },
      error: () => { this.snackbar.error('Failed'); this.saving.set(false); }
    });
  }

  deleteItem(item: HeroSlide): void {
    if (!confirm(`Delete slide "${item.title}"?`)) return;
    this.admin.deleteHeroSlide(item.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.load(); },
      error: () => this.snackbar.error('Failed')
    });
  }
}
