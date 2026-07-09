import { Component, signal, HostListener, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SiteSettings } from '../../models';
import { ThemeService } from '../../core/services/theme.service';
import { PublicService } from '../../core/services/public.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly theme = inject(ThemeService);
  isScrolled = signal(false);
  isMenuOpen = signal(false);
  settings = signal<SiteSettings>({});

  ngOnInit(): void {
    this.publicService.getSettings().subscribe({
      next: (res) => this.settings.set(res.data),
      error: () => {}
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
    this.updateBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.updateBodyScroll();
  }

  setSettings(settings: SiteSettings): void {
    this.settings.set(settings);
  }

  private updateBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }
}