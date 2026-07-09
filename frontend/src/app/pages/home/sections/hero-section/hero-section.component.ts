import {
  Component,
  input,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  effect,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroSlide } from '../../../../models';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  slides = input<HeroSlide[]>([]);
  currentIndex = signal(0);
  paused = signal(false);
  loadedIndices = signal<Set<number>>(new Set([0]));

  private intervalId?: ReturnType<typeof setInterval>;
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      const idx = this.currentIndex();
      const len = this.slides().length;
      if (len === 0) return;

      this.loadedIndices.update((set) => {
        const next = new Set(set);
        next.add(idx);
        next.add((idx + 1) % len);
        next.add((idx - 1 + len) % len);
        return next;
      });
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId) || this.slides().length <= 1) return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev(true);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next(true);
    }
  }

  next(manual = false): void {
    const len = this.slides().length;
    if (len === 0) return;
    this.currentIndex.update((i) => (i + 1) % len);
    if (manual) this.restartAutoplay();
  }

  prev(manual = false): void {
    const len = this.slides().length;
    if (len === 0) return;
    this.currentIndex.update((i) => (i - 1 + len) % len);
    if (manual) this.restartAutoplay();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoplay();
  }

  pause(): void {
    this.paused.set(true);
    this.stopAutoplay();
  }

  resume(): void {
    this.paused.set(false);
    this.startAutoplay();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].screenX - this.touchStartX;
    const dy = event.changedTouches[0].screenY - this.touchStartY;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {
      this.next(true);
    } else {
      this.prev(true);
    }
  }

  shouldLoadImage(index: number): boolean {
    return this.loadedIndices().has(index);
  }

  isExternal(link?: string): boolean {
    return !!link && /^https?:\/\//i.test(link);
  }

  routePath(link?: string): string {
    if (!link) return '/testimonials';
    const path = link.split('#')[0];
    return path || '/';
  }

  routeFragment(link?: string): string | undefined {
    if (!link?.includes('#')) return undefined;
    const fragment = link.split('#')[1];
    return fragment || undefined;
  }

  isHashOnly(link?: string): boolean {
    return !!link && link.startsWith('#');
  }

  hashTarget(link?: string): string {
    return link?.startsWith('#') ? link : '#';
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    if (!isPlatformBrowser(this.platformId) || this.slides().length <= 1 || this.paused()) return;
    this.intervalId = setInterval(() => this.next(), AUTOPLAY_MS);
  }

  private stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private restartAutoplay(): void {
    if (!this.paused()) {
      this.startAutoplay();
    }
  }
}
