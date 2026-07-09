import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { Industry } from '../../../models';

@Component({
  selector: 'app-admin-industries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-industries.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminIndustriesComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  items = signal<Industry[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    icon: [''],
    imageUrl: [''],
    sortOrder: [0],
    active: [true]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getIndustries().subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ active: true, sortOrder: 0 });
    this.showModal.set(true);
  }

  openEdit(item: Industry): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const data = this.form.value as Partial<Industry>;
    const req = id ? this.admin.updateIndustry(id, data) : this.admin.createIndustry(data);
    req.subscribe({
      next: () => { this.snackbar.success('Saved'); this.closeModal(); this.load(); this.saving.set(false); },
      error: () => { this.snackbar.error('Failed'); this.saving.set(false); }
    });
  }

  deleteItem(item: Industry): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.admin.deleteIndustry(item.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.load(); },
      error: () => this.snackbar.error('Failed to delete')
    });
  }
}
