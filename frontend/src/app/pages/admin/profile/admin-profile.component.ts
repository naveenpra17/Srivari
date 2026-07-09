import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  savingProfile = signal(false);
  savingPassword = signal(false);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    avatarUrl: ['']
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.auth.refreshProfile().subscribe();
    const user = this.auth.user();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? '',
        avatarUrl: user.avatarUrl ?? ''
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    this.auth.updateProfile(this.profileForm.value as any).subscribe({
      next: () => {
        this.snackbar.success('Profile updated');
        this.savingProfile.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to update profile');
        this.savingProfile.set(false);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.snackbar.error('Passwords do not match');
      return;
    }
    this.savingPassword.set(true);
    this.auth.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.snackbar.success('Password changed successfully');
        this.passwordForm.reset();
        this.savingPassword.set(false);
      },
      error: () => {
        this.snackbar.error('Failed to change password');
        this.savingPassword.set(false);
      }
    });
  }
}
