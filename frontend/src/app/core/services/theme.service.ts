import { Injectable, inject, signal, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const THEME_KEY = 'motors_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _darkMode = signal(this.loadTheme());

  readonly darkMode = this._darkMode.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const isDark = this._darkMode();
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      });
    }
  }

  toggle(): void {
    this._darkMode.update(v => !v);
  }

  setDarkMode(dark: boolean): void {
    this._darkMode.set(dark);
  }

  private loadTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
