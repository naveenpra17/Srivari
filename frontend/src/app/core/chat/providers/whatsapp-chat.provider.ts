import { Injectable } from '@angular/core';
import { ChatPageContext, ChatProvider, ChatWidgetConfig } from '../chat.types';
import { resolveChatMessage } from '../chat-message.util';

@Injectable({ providedIn: 'root' })
export class WhatsappChatProvider implements ChatProvider {
  readonly type = 'whatsapp' as const;

  isSupported(): boolean {
    return true;
  }

  openChat(config: ChatWidgetConfig, context: ChatPageContext): void {
    const phone = this.normalizePhone(config.phone);
    if (!phone) return;

    const message = resolveChatMessage(config, context);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
