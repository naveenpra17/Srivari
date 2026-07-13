import { ChangeDetectionStrategy, Component, HostListener, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettings } from '../../models';
import { PublicService } from '../../core/services/public.service';

interface NavLink {
  path: string;
  label: string;
  exact: boolean;
  fragment?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  isScrolled = signal(false);
  isMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchQuery = signal('');
  settings = signal<SiteSettings>({});

  readonly navLinks: NavLink[] = [
    { path: '/', label: 'Home', exact: true },
    { path: '/products', label: 'Products', exact: false },
    { path: '/', fragment: 'industries', label: 'Industries', exact: false },
    { path: '/about', label: 'About', exact: false },
    { path: '/', fragment: 'contact', label: 'Contact', exact: false }
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  ngOnInit(): void {
    this.publicService.getSettings().subscribe({
      next: (res) => this.settings.set(res.data),
      error: () => {}
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 40);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
    this.updateBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.updateBodyScroll();
  }

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
    if (!this.isSearchOpen()) this.searchQuery.set('');
  }

  submitSearch(): void {
    const q = this.searchQuery().trim();
    this.isSearchOpen.set(false);
    this.closeMenu();
    if (q) {
      this.router.navigate(['/products'], { queryParams: { q } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  isNavActive(link: NavLink): boolean {
    const tree = this.router.parseUrl(this.currentUrl());
    const segments = tree.root.children['primary']?.segments ?? [];
    const path = '/' + segments.map((segment) => segment.path).join('/');
    const normalizedPath = path === '//' ? '/' : path;
    const fragment = tree.fragment ?? null;

    if (link.fragment) {
      return normalizedPath === '/' && fragment === link.fragment;
    }

    if (link.path === '/' && link.exact) {
      return normalizedPath === '/' && !fragment;
    }

    if (link.exact) {
      return normalizedPath === link.path;
    }

    return normalizedPath === link.path || normalizedPath.startsWith(`${link.path}/`);
  }

  private updateBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }
}
