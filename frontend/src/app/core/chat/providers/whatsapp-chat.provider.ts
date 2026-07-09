import { Injectable } from '@angular/core';
import { ChatPageContext, ChatProvider, ChatWidgetConfig } from '../chat.types';

@Injectable({ providedIn: 'root' })
export class WhatsappChatProvider implements ChatProvider {
  readonly type = 'whatsapp' as const;

  isSupported(): boolean {
    return true;
  }

  openChat(config: ChatWidgetConfig, context: ChatPageContext): void {
    const phone = this.normalizePhone(config.phone);
    if (!phone) return;

    const message = this.resolveMessage(config, context);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private resolveMessage(config: ChatWidgetConfig, context: ChatPageContext): string {
    const template = config.messages[context.type] ?? config.messages.general;
    return template.replace(/\{productName\}/g, context.productName ?? 'your product');
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
