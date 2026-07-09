import { Component, inject } from '@angular/core';
import { ChatWidgetService } from '../../../core/chat/chat-widget.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  template: `
    @if (chat.visible()) {
      <div class="chat-widget" role="complementary" aria-label="Live chat support">
        <button
          type="button"
          class="chat-widget-btn whatsapp"
          (click)="chat.openChat()"
          [attr.aria-label]="chat.tooltip()"
          [attr.data-tooltip]="chat.tooltip()">
          <svg class="chat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L0 24l6.335-1.662A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.78 9.78 0 01-4.99-1.378l-.358-.214-3.76.986 1.004-3.666-.233-.375A9.78 9.78 0 012.18 12C2.18 6.57 6.57 2.18 12 2.18S21.82 6.57 21.82 12 17.43 21.82 12 21.82z"/>
          </svg>
        </button>
      </div>
    }
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: var(--chat-widget-bottom, 24px);
      right: var(--chat-widget-right, 24px);
      z-index: 1050;
      animation: chatEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .chat-widget-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      min-width: 48px;
      min-height: 48px;

      &:hover, &:focus-visible {
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
        outline: none;
      }

      &:active {
        transform: scale(0.96);
      }

      &.whatsapp {
        background: #25d366;
        color: white;
      }

      &::after {
        content: attr(data-tooltip);
        position: absolute;
        right: calc(100% + 12px);
        top: 50%;
        transform: translateY(-50%) translateX(8px);
        background: var(--primary);
        color: white;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
        box-shadow: var(--shadow-md);
      }

      &:hover::after, &:focus-visible::after {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }

    .chat-icon {
      width: 28px;
      height: 28px;
    }

    @keyframes chatEnter {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .chat-widget {
        bottom: 20px;
        right: 16px;
      }

      .chat-widget-btn {
        width: 52px;
        height: 52px;

        &::after {
          display: none;
        }
      }
    }

    @media (max-width: 480px) {
      .chat-widget-btn::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 8px);
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.7rem;
        white-space: nowrap;
        opacity: 0;
        animation: tooltipFade 4s ease 1s forwards;
        pointer-events: none;
      }
    }

    @keyframes tooltipFade {
      0%, 70% { opacity: 1; }
      100% { opacity: 0; }
    }
  `]
})
export class ChatWidgetComponent {
  readonly chat = inject(ChatWidgetService);
}
