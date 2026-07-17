import { Component, inject, computed, signal, effect, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="toast-container" 
      [class.top-right]="position() === 'top-right'"
      [class.top-left]="position() === 'top-left'"
      [class.bottom-right]="position() === 'bottom-right'"
      [class.bottom-left]="position() === 'bottom-left'"
      [class.top-center]="position() === 'top-center'"
      [class.bottom-center]="position() === 'bottom-center'"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      @for (toast of visibleToasts(); track toast.id) {
        <div 
          class="toast" 
          [class]="toast.type"
          [class.entering]="enteringIds().has(toast.id)"
          [class.exiting]="exitingIds().has(toast.id)"
          [attr.data-toast-id]="toast.id"
          role="alert"
          [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast-icon" aria-hidden="true">
            <svg *ngIf="toast.type === 'success'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <svg *ngIf="toast.type === 'error'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <svg *ngIf="toast.type === 'warning'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg *ngIf="toast.type === 'info'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message" *ngIf="toast.message">{{ toast.message }}</div>
          </div>
          
          <button 
            *ngIf="toast.dismissible !== false" 
            class="toast-close" 
            (click)="dismiss(toast.id)"
            aria-label="Dismiss notification"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          @if (toast.action) {
            <button 
              class="toast-action" 
              (click)="executeAction(toast)"
              type="button"
            >
              {{ toast.action.label }}
            </button>
          }
          
          <div 
            class="toast-progress" 
            [style.width.%]="getProgress(toast.id)"
            *ngIf="toast.duration !== 0"
            aria-hidden="true"
          ></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      pointer-events: none;
      max-width: 420px;
      width: 100%;
      box-sizing: border-box;
    }

    .toast-container.top-right { top: 16px; right: 16px; align-items: flex-end; }
    .toast-container.top-left { top: 16px; left: 16px; align-items: flex-start; }
    .toast-container.bottom-right { bottom: 16px; right: 16px; align-items: flex-end; }
    .toast-container.bottom-left { bottom: 16px; left: 16px; align-items: flex-start; }
    .toast-container.top-center { top: 16px; left: 50%; transform: translateX(-50%); align-items: center; }
    .toast-container.bottom-center { bottom: 16px; left: 50%; transform: translateX(-50%); align-items: center; }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      background: var(--toast-bg, #ffffff);
      box-shadow: var(--toast-shadow, 0 8px 32px rgba(0, 0, 0, 0.12));
      border: 1px solid var(--toast-border, rgba(0, 0, 0, 0.08));
      min-width: 300px;
      max-width: 420px;
      animation: toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .toast.entering {
      animation: toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast.exiting {
      animation: toastExit 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
    }

    @keyframes toastEnter {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes toastExit {
      from {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateX(100%) scale(0.95);
      }
    }

    /* Toast type variants */
    .toast.success {
      --toast-bg: #f0fdf4;
      --toast-border: #bbf7d0;
      --toast-icon: #16a34a;
    }

    .toast.error {
      --toast-bg: #fef2f2;
      --toast-border: #fecaca;
      --toast-icon: #dc2626;
    }

    .toast.warning {
      --toast-bg: #fffbeb;
      --toast-border: #fde68a;
      --toast-icon: #d97706;
    }

    .toast.info {
      --toast-bg: #eff6ff;
      --toast-border: #bfdbfe;
      --toast-icon: #2563eb;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: var(--toast-icon);
      margin-top: 2px;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      line-height: 1.4;
      color: var(--text-primary, #1f2937);
    }

    .toast-message {
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-secondary, #6b7280);
      margin-top: 4px;
    }

    .toast-close {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--text-tertiary, #9ca3af);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: -4px;
      margin-right: -4px;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.06);
      color: var(--text-primary, #1f2937);
    }

    .toast-close:focus-visible {
      outline: 2px solid var(--primary, #0a2b5e);
      outline-offset: 2px;
    }

    .toast-action {
      flex-shrink: 0;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary, #0a2b5e);
      background: transparent;
      border: 1px solid var(--primary, #0a2b5e);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 4px;
    }

    .toast-action:hover {
      background: var(--primary, #0a2b5e);
      color: white;
    }

    .toast-action:focus-visible {
      outline: 2px solid var(--primary, #0a2b5e);
      outline-offset: 2px;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--toast-icon);
      border-radius: 0 0 12px 12px;
      transform-origin: left center;
      transition: width 0.1s linear;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .toast.success { --toast-bg: #14532d; --toast-border: #166534; }
      .toast.error { --toast-bg: #7f1d1d; --toast-border: #991b1b; }
      .toast.warning { --toast-bg: #78350f; --toast-border: #92400e; }
      .toast.info { --toast-bg: #1e3a5f; --toast-border: #1e40af; }
      
      .toast-close:hover { background: rgba(255, 255, 255, 0.1); }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none !important;
      }
      .toast.entering, .toast.exiting {
        animation: none !important;
      }
      .toast-progress {
        transition: none !important;
      }
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .toast-container {
        left: 12px !important;
        right: 12px !important;
        max-width: none;
        align-items: stretch !important;
      }
      .toast {
        min-width: 0;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  
  // Position signal - can be made configurable later
  readonly position = signal<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('top-right');
  
  // Track entering/exiting toasts for animations
  readonly enteringIds = signal<Set<string>>(new Set());
  readonly exitingIds = signal<Set<string>>(new Set());
  
  // Progress tracking for auto-dismiss
  private progressTimers = new Map<string, number>();
  private progressStartTimes = new Map<string, number>();
  private progressDurations = new Map<string, number>();
  
  readonly visibleToasts = computed<Toast[]>(() => this.toastService.toasts());

  constructor() {
    // Track toast additions/removals for animations
    effect(() => {
      const toasts: Toast[] = this.toastService.toasts();
      const currentIds = new Set(toasts.map(t => t.id));
      
      // Check for new toasts
      this.enteringIds.update(prev => {
        const next = new Set(prev);
        toasts.forEach(t => {
          if (!prev.has(t.id)) {
            next.add(t.id);
            // Remove entering class after animation
            setTimeout(() => {
              this.enteringIds.update(e => { const n = new Set(e); n.delete(t.id); return n; });
            }, 400);
          }
        });
        return next;
      });
    });
  }

  dismiss(id: string): void {
    // Mark as exiting
    this.exitingIds.update(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    
    // Clear progress timer
    if (this.progressTimers.has(id)) {
      clearInterval(this.progressTimers.get(id)!);
      this.progressTimers.delete(id);
    }
    
    // Dismiss after exit animation
    setTimeout(() => {
      this.toastService.dismiss(id);
      this.exitingIds.update(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }

  executeAction(toast: Toast): void {
    if (toast.action?.callback) {
      toast.action.callback();
    }
    if (toast.dismissible !== false) {
      this.dismiss(toast.id);
    }
  }

  getProgress(id: string): number {
    const startTime = this.progressStartTimes.get(id);
    const duration = this.progressDurations.get(id);
    
    if (!startTime || !duration || duration === 0) return 100;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.max(0, Math.min(100, 100 - (elapsed / duration) * 100));
    return progress;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    const toasts: Toast[] = this.toastService.toasts();
    if (toasts.length > 0) {
      this.dismiss(toasts[toasts.length - 1].id);
    }
  }
}