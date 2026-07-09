import { Component, HostListener, inject, signal } from '@angular/core';
import { ChatWidgetService } from '../../../core/chat/chat-widget.service';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  template: `
    <div class="floating-actions" role="group" aria-label="Quick actions">
      @if (showScrollTop()) {
        <button type="button" class="fab fab-scroll" (click)="scrollToTop()" aria-label="Back to top">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
        </button>
      }
      <button type="button" class="fab fab-contact" (click)="scrollToContact()" aria-label="Contact us" data-tooltip="Contact Us">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      </button>
      @if (chat.visible()) {
        <button
          type="button"
          class="fab fab-whatsapp"
          (click)="chat.openChat()"
          [attr.aria-label]="chat.tooltip()"
          [attr.data-tooltip]="chat.tooltip()">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L0 24l6.335-1.662A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .floating-actions {
      position: fixed;
      bottom: max(20px, env(safe-area-inset-bottom));
      right: max(16px, env(safe-area-inset-right));
      z-index: 1050;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .fab {
      width: 52px;
      height: 52px;
      min-width: 48px;
      min-height: 48px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 24px rgba(10, 43, 94, 0.18);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      animation: fabEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;

      &:hover, &:focus-visible {
        transform: translateY(-3px) scale(1.05);
        outline: none;
      }
    }

    .fab-scroll {
      background: var(--secondary);
      color: white;
      animation-delay: 0.05s;
    }

    .fab-contact {
      background: #0A2B5E;
      color: white;
      animation-delay: 0.1s;
    }

    .fab-whatsapp {
      background: #25d366;
      color: white;
      animation-delay: 0.15s;
    }

    .fab[data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      right: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: #0A2B5E;
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .fab[data-tooltip]:hover::after,
    .fab[data-tooltip]:focus-visible::after {
      opacity: 1;
    }

    @keyframes fabEnter {
      from { opacity: 0; transform: translateY(16px) scale(0.85); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 768px) {
      .fab[data-tooltip]::after { display: none; }
    }
  `]
})
export class FloatingActionsComponent {
  readonly chat = inject(ChatWidgetService);
  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToContact(): void {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  }
}
