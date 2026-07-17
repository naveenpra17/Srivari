import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" width="48" height="48" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="#0A2B5E" stroke-width="2"/>
              <circle cx="20" cy="20" r="8" fill="#0A2B5E"/>
            </svg>
          </div>
          <h1>Sri Vaari Traders Admin</h1>
          <p>Sign in to manage your website</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="admin-email">Email</label>
            <input id="admin-email" type="email" formControlName="email" placeholder="admin@motors.com" autocomplete="username">
          </div>
          <div class="form-group">
            <label for="admin-password">Password</label>
            <input id="admin-password" type="password" formControlName="password" placeholder="Enter password" autocomplete="current-password">
          </div>
          <button type="submit" class="btn-secondary-custom w-100" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </main>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 2rem;
    }
    .login-card {
      background: #ffffff; border-radius: var(--border-radius); padding: 3rem;
      width: 100%; max-width: 420px; box-shadow: var(--shadow-lg);
      color: #1e293b;
    }
    .login-header {
      text-align: center; margin-bottom: 2rem;
      h1 { color: #0A2B5E; font-size: 1.5rem; margin: 1rem 0 0.5rem; }
      p { color: #475569; font-size: 0.9rem; }
    }
    .form-group {
      margin-bottom: 1.25rem;
      label { display: block; font-size: 0.85rem; font-weight: 600; color: #0A2B5E; margin-bottom: 0.5rem; }
      input {
        width: 100%; padding: 12px 16px; border: 1px solid #e0e0e0;
        border-radius: 12px; font-family: inherit; outline: none;
        &:focus { border-color: var(--primary); }
      }
    }
    .w-100 { width: 100%; justify-content: center; }
  `]
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  loading = signal(false);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.snackbar.success('Welcome back!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.snackbar.error('Invalid email or password');
        this.loading.set(false);
      }
    });
  }
}
