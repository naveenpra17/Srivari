export type ChatProviderType = 'whatsapp' | 'tawk' | 'crisp' | 'intercom' | 'custom' | 'none';

export type ChatMessageContext = 'general' | 'product' | 'contact';

export interface ChatPageContext {
  type: ChatMessageContext;
  productName?: string;
  productSlug?: string;
  categoryName?: string;
  pageUrl?: string;
}

export interface ChatWidgetConfig {
  enabled: boolean;
  provider: ChatProviderType;
  tooltip: string;
  phone: string;
  messages: Record<ChatMessageContext, string>;
}

export interface ChatProvider {
  readonly type: ChatProviderType;
  isSupported(): boolean;
  openChat(config: ChatWidgetConfig, context: ChatPageContext): void;
}
