import { Injectable, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'motors_theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state
  readonly mode = signal<ThemeMode>('system');
  readonly resolvedTheme = signal<'light' | 'dark'>('light');
  readonly isTransitioning = signal(false);

  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      if (stored) {
        this.mode.set(stored);
      }
      this.updateResolvedTheme();
      this.watchSystemTheme();
    }

    // Apply theme changes to document
    effect(() => {
      if (!this.isBrowser) return;
      const theme = this.resolvedTheme();
      this.isTransitioning.set(true);
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, this.mode());
      
      // Allow CSS transition to complete
      setTimeout(() => this.isTransitioning.set(false), 300);
    });
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handler = (e: MediaQueryListEvent) => {
      if (this.mode() === 'system') {
        this.updateResolvedTheme(e.matches);
      }
    };
    mediaQuery.addEventListener?.('change', handler);
  }

  private updateResolvedTheme(isDark?: boolean): void {
    if (isDark === undefined) {
      isDark = window.matchMedia(MEDIA_QUERY).matches;
    }
    this.resolvedTheme.set(isDark ? 'dark' : 'light');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    if (mode !== 'system') {
      this.updateResolvedTheme(mode === 'dark');
    } else {
      this.updateResolvedTheme();
    }
  }

  toggle(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(this.mode());
    this.setMode(modes[(currentIndex + 1) % modes.length]);
  }

  // Get icon name for current mode
  getModeIcon(): string {
    switch (this.mode()) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'system': return 'monitor';
    }
  }

  // Get label for current mode
  getModeLabel(): string {
    switch (this.mode()) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  }
}
