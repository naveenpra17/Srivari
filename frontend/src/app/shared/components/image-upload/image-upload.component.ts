import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-upload">
      @if (imageUrl()) {
        <div class="preview">
          <img [src]="imageUrl()" alt="Preview">
          <button type="button" class="remove-btn" (click)="clear()">&times;</button>
        </div>
      }
      <label class="upload-btn" [class.uploading]="uploading()">
        <input type="file" accept="image/*" (change)="onFileSelected($event)" [disabled]="uploading()">
        @if (uploading()) {
          Uploading...
        } @else {
          {{ imageUrl() ? 'Change Image' : 'Upload Image' }}
        }
      </label>
    </div>
  `,
  styles: [`
    .image-upload { display: flex; flex-direction: column; gap: 0.75rem; }
    .preview {
      position: relative; width: 120px; height: 120px; border-radius: 12px; overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; }
      .remove-btn {
        position: absolute; top: 4px; right: 4px; width: 24px; height: 24px;
        border-radius: 50%; background: rgba(0,0,0,0.6); color: white; border: none;
        cursor: pointer; font-size: 1rem; line-height: 1;
      }
    }
    .upload-btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 20px; background: rgba(10,43,94,0.08); color: var(--primary);
      border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
      transition: var(--transition); width: fit-content;
      input { display: none; }
      &:hover { background: rgba(10,43,94,0.15); }
      &.uploading { opacity: 0.6; pointer-events: none; }
    }
  `]
})
export class ImageUploadComponent {
  folder = input('general');
  imageUrl = input<string>('');
  imageUrlChange = output<string>();

  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);

  uploading = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.admin.uploadImage(file, this.folder()).subscribe({
      next: (res) => {
        this.imageUrlChange.emit(res.data.url);
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.snackbar.error('Image upload failed');
        this.uploading.set(false);
        input.value = '';
      }
    });
  }

  clear(): void {
    this.imageUrlChange.emit('');
  }
}
