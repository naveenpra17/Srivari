import { Component, HostListener, inject, signal } from '@angular/core';
import { ChatWidgetService } from '../../../core/chat/chat-widget.service';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  templateUrl: './floating-actions.component.html',
  styleUrl: './floating-actions.component.scss'
})
export class FloatingActionsComponent {
  readonly chat = inject(ChatWidgetService);
  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop.set(window.scrollY > 500);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.chat.isPanelOpen()) {
      this.chat.closePanel();
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
