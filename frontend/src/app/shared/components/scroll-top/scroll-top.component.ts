import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button class="scroll-top" (click)="scrollToTop()" aria-label="Scroll to top">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    }
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      bottom: var(--scroll-top-bottom, 30px);
      right: var(--scroll-top-right, 30px);
      width: 48px;
      height: 48px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
      background: var(--secondary);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-md);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      animation: fadeIn 0.3s ease;

      &:hover { transform: translateY(-4px); background: var(--secondary-light); }
    }

    @media (max-width: 768px) {
      .scroll-top {
        bottom: 88px;
        right: 16px;
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class ScrollTopComponent {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
