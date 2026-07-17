import { Component, inject, computed, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-toggle" [class.transitioning]="theme.isTransitioning()">
      <button
        class="theme-btn"
        [attr.aria-label]="'Open theme selection menu, current: ' + currentModeLabel()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'menu'"
        (click)="toggleDropdown()"
        [disabled]="theme.isTransitioning()"
        type="button">
        <span class="theme-icon" [attr.data-mode]="theme.mode()">
          <svg *ngIf="theme.mode() === 'light'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zm-10.96 10.96a.996.996 0 000 1.41.996.996 0 001.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06zM7 11c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/>
          </svg>
          <svg *ngIf="theme.mode() === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
          <svg *ngIf="theme.mode() === 'system'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
          </svg>
        </span>
        <span class="theme-label">{{ currentModeLabel() }}</span>
      </button>
      
      <!-- Dropdown menu -->
      <div class="theme-dropdown" *ngIf="isOpen()" @fadeIn>
        <div class="dropdown-arrow" aria-hidden="true"></div>
        <button 
          class="dropdown-item" 
          *ngFor="let mode of modes" 
          [class.active]="theme.mode() === mode.value"
          (click)="selectMode(mode.value)"
          [disabled]="theme.isTransitioning()"
          type="button">
          <span class="item-icon">
            <svg *ngIf="mode.value === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zm-10.96 10.96a.996.996 0 000 1.41.996.996 0 001.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06zM7 11c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/></svg>
            <svg *ngIf="mode.value === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
            <svg *ngIf="mode.value === 'system'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
          </span>
          <span class="item-label">{{ mode.label }}</span>
          <span class="item-check" *ngIf="theme.mode() === mode.value" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-toggle {
      position: relative;
      display: inline-block;
    }

    .theme-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 12px;
      background: var(--white, #fff);
      color: var(--text-dark, #1e293b);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .theme-btn:hover:not(:disabled) {
      border-color: var(--primary, #0a2b5e);
      background: var(--primary-light, rgba(10, 43, 94, 0.08));
    }

    .theme-btn:focus-visible {
      outline: 2px solid var(--primary, #0a2b5e);
      outline-offset: 2px;
    }

    .theme-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .theme-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--primary-light, rgba(10, 43, 94, 0.1));
      color: var(--primary, #0a2b5e);
      transition: transform 0.3s ease;
    }

    .theme-btn:hover .theme-icon {
      transform: rotate(15deg) scale(1.1);
    }

    .theme-label {
      max-width: 0;
      overflow: hidden;
      transition: max-width 0.2s ease, opacity 0.2s ease;
      opacity: 0;
    }

    .theme-btn:hover .theme-label {
      max-width: 80px;
      opacity: 1;
    }

    .theme-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 180px;
      padding: 8px;
      background: var(--white, #fff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .dropdown-arrow {
      position: absolute;
      top: -6px;
      right: 16px;
      width: 12px;
      height: 12px;
      background: var(--white, #fff);
      border-left: 1px solid var(--border-color, #e2e8f0);
      border-top: 1px solid var(--border-color, #e2e8f0);
      transform: rotate(45deg);
      pointer-events: none;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      background: var(--white, #fff);
      color: var(--text-dark, #1e293b);
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .dropdown-item:hover:not(:disabled) {
      background: var(--primary-light, rgba(10, 43, 94, 0.08));
      color: var(--primary, #0a2b5e);
    }

    .dropdown-item:focus-visible {
      outline: 2px solid var(--primary, #0a2b5e);
      outline-offset: -2px;
    }

    .dropdown-item.active {
      background: var(--primary-light, rgba(10, 43, 94, 0.12));
      color: var(--primary, #0a2b5e);
    }

    .item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      color: var(--text-muted, #64748b);
      transition: all 0.2s ease;
    }

    .dropdown-item.active .item-icon,
    .dropdown-item:hover .item-icon {
      background: var(--primary-light, rgba(10, 43, 94, 0.15));
      color: var(--primary, #0a2b5e);
    }

    .item-check {
      margin-left: auto;
      color: var(--primary, #0a2b5e);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-label {
      color: #1e293b; /* Explicit dark color for WCAG AA contrast on white */
      font-weight: 500;
    }

    .dropdown-item:hover .item-label,
    .dropdown-item:focus .item-label {
      color: #0a2b5e;
    }

    .dropdown-item.active {
      background: rgba(10, 43, 94, 0.15);
    }

    .dropdown-item.active .item-label {
      color: #0a2b5e; /* Dark blue on light blue background - WCAG AA compliant */
      font-weight: 600;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Dark mode adjustments */
    [data-theme="dark"] .theme-btn {
      border-color: var(--border-color, #30363d);
      background: var(--white, #161b22);
    }

    [data-theme="dark"] .theme-dropdown {
      background: #161b22;
      border-color: var(--border-color, #30363d);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    [data-theme="dark"] .dropdown-arrow {
      background: #161b22;
      border-color: var(--border-color, #30363d);
    }

    [data-theme="dark"] .dropdown-item {
      background: #161b22;
      color: #f0f6fc;
    }

    [data-theme="dark"] .item-label {
      color: #f0f6fc; /* Explicit light color for WCAG AA contrast on dark */
    }

    [data-theme="dark"] .dropdown-item:hover .item-label,
    [data-theme="dark"] .dropdown-item:focus .item-label {
      color: #60a5fa;
    }

    [data-theme="dark"] .dropdown-item:hover:not(:disabled),
    [data-theme="dark"] .dropdown-item:focus:not(:disabled) {
      background: rgba(96, 165, 250, 0.15);
    }

    [data-theme="dark"] .dropdown-item.active {
      background: rgba(96, 165, 250, 0.25);
      color: #60a5fa;
    }

    [data-theme="dark"] .dropdown-item.active .item-label {
      color: #60a5fa; /* Light blue on semi-transparent blue - WCAG AA compliant */
      font-weight: 600;
    }

    [data-theme="dark"] .dropdown-item.active .item-icon,
    [data-theme="dark"] .dropdown-item:hover .item-icon {
      background: rgba(96, 165, 250, 0.25);
      color: #60a5fa;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .theme-btn,
      .theme-icon,
      .theme-label,
      .theme-dropdown,
      .dropdown-item,
      .item-icon {
        transition: none !important;
        animation: none !important;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ]
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  readonly isOpen = signal(false);

  readonly modes = [
    { value: 'light' as ThemeMode, label: 'Light' },
    { value: 'dark' as ThemeMode, label: 'Dark' },
    { value: 'system' as ThemeMode, label: 'System' }
  ];

  readonly currentModeLabel = computed(() => {
    const mode = this.theme.mode();
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  });

  readonly nextModeLabel = computed(() => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(this.theme.mode());
    return modes[(currentIndex + 1) % modes.length];
  });

  selectMode(mode: ThemeMode): void {
    this.theme.setMode(mode);
    this.isOpen.set(false);
  }

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-toggle')) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }
}