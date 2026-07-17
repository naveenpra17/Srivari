import { Injectable, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
  dismissible?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private idCounter = 0;

  // Internal signal for toasts
  private readonly _toasts = signal<Toast[]>([]);
  
  // Public readonly signal
  readonly toasts = this._toasts.asReadonly();

  // Computed signals for different toast types
  readonly successToasts = computed(() => this._toasts().filter(t => t.type === 'success'));
  readonly errorToasts = computed(() => this._toasts().filter(t => t.type === 'error'));
  readonly warningToasts = computed(() => this._toasts().filter(t => t.type === 'warning'));
  readonly infoToasts = computed(() => this._toasts().filter(t => t.type === 'info'));

  // Default durations per type (ms)
  private readonly defaultDurations: Record<ToastType, number> = {
    success: 4000,
    error: 6000,
    warning: 5000,
    info: 4000
  };

  constructor() {
    // Cleanup effect for browser environment
    if (this.isBrowser) {
      effect(() => {
        const toasts = this._toasts();
        toasts.forEach(toast => {
          if (toast.duration !== 0) {
            const duration = toast.duration ?? this.defaultDurations[toast.type];
            setTimeout(() => this.dismiss(toast.id), duration);
          }
        });
      });
    }
  }

  private generateId(): string {
    return `toast_${++this.idCounter}_${Date.now()}`;
  }

  private addToast(toast: Omit<Toast, 'id'>): string {
    const id = this.generateId();
    const newToast: Toast = { ...toast, id };
    this._toasts.update(current => [...current, newToast]);
    return id;
  }

  success(title: string, message?: string, options?: Partial<Toast>): string {
    return this.addToast({ type: 'success', title, message, ...options });
  }

  error(title: string, message?: string, options?: Partial<Toast>): string {
    return this.addToast({ type: 'error', title, message, ...options });
  }

  warning(title: string, message?: string, options?: Partial<Toast>): string {
    return this.addToast({ type: 'warning', title, message, ...options });
  }

  info(title: string, message?: string, options?: Partial<Toast>): string {
    return this.addToast({ type: 'info', title, message, ...options });
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this._toasts.set([]);
  }

  // Convenience method for action toasts
  actionToast(
    type: ToastType,
    title: string,
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    options?: Partial<Toast>
  ): string {
    return this.addToast({
      type,
      title,
      message,
      action: { label: actionLabel, callback: actionCallback },
      duration: 0, // Don't auto-dismiss action toasts
      dismissible: true,
      ...options
    });
  }
}