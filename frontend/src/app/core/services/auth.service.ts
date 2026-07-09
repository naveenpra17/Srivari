import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, UserProfile } from '../../models';

const TOKEN_KEY = 'motors_access_token';
const REFRESH_KEY = 'motors_refresh_token';
const USER_KEY = 'motors_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _user = signal<UserProfile | null>(this.loadUser());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.roles?.includes('ADMIN') ?? false);
  readonly isEditor = computed(() => {
    const roles = this._user()?.roles ?? [];
    return roles.includes('ADMIN') || roles.includes('EDITOR');
  });
  readonly isViewer = computed(() => this._user()?.roles?.includes('VIEWER') ?? false);
  readonly canEdit = computed(() => this.isAdmin() || this.isEditor());
  readonly canDelete = computed(() => this.isAdmin());

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  logout(): void {
    this.api.post<void>('/auth/logout', {}).subscribe({
      complete: () => this.clearSession()
    });
    this.clearSession();
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    return this.api.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  refreshProfile() {
    return this.api.get<AuthResponse>('/auth/me').pipe(
      tap(res => {
        if (res.data?.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          this._user.set(res.data.user);
        }
      })
    );
  }

  updateProfile(data: Partial<UserProfile>) {
    return this.api.put<AuthResponse>('/auth/profile', data).pipe(
      tap(res => {
        if (res.data?.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          this._user.set(res.data.user);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.api.put<void>('/auth/password', { currentPassword, newPassword });
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    localStorage.setItem(REFRESH_KEY, auth.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    this._user.set(auth.user);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  private loadUser(): UserProfile | null {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
