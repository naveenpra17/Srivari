import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { Category } from '../../../models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, ImageUploadComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminCategoriesComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  items = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    imageUrl: [''],
    sortOrder: [0],
    active: [true]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getCategories().subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ active: true, sortOrder: 0 });
    this.showModal.set(true);
  }

  openEdit(item: Category): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); this.editingId.set(null); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const data = this.form.value as Partial<Category>;
    const id = this.editingId();
    const req = id ? this.admin.updateCategory(id, data) : this.admin.createCategory(data);
    req.subscribe({
      next: () => {
        this.snackbar.success(id ? 'Category updated' : 'Category created');
        this.closeModal();
        this.load();
        this.saving.set(false);
      },
      error: () => { this.snackbar.error('Failed to save'); this.saving.set(false); }
    });
  }

  deleteItem(item: Category): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.admin.deleteCategory(item.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.load(); },
      error: () => this.snackbar.error('Failed to delete')
    });
  }

  onCategoryDrop(event: CdkDragDrop<Category[]>): void {
    const items = [...this.items()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Update sortOrder for all affected items
    const updates = items.map((item, index) => ({
      id: item.id,
      sortOrder: index
    }));

    this.saveCategoryOrder(updates);
  }

  private saveCategoryOrder(updates: { id: number; sortOrder: number }[]): void {
    let completed = 0;
    const total = updates.length;
    let hasError = false;

    updates.forEach(update => {
      this.admin.updateCategory(update.id, { sortOrder: update.sortOrder }).subscribe({
        next: () => {
          completed++;
          if (completed === total && !hasError) {
            this.snackbar.success('Category order updated');
            this.load();
          }
        },
        error: () => {
          if (!hasError) {
            hasError = true;
            this.snackbar.error('Failed to reorder categories');
          }
        }
      });
    });
  }
}
