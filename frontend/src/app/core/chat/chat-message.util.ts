import { ChatPageContext, ChatWidgetConfig } from './chat.types';

export function resolveChatMessage(config: ChatWidgetConfig, context: ChatPageContext): string {
  const template = config.messages[context.type] ?? config.messages.general;
  const pageUrl = context.pageUrl ?? (typeof window !== 'undefined' ? window.location.href : '');

  return template
    .replace(/\{productName\}/g, context.productName ?? 'your product')
    .replace(/\{productSlug\}/g, context.productSlug ?? '')
    .replace(/\{categoryName\}/g, context.categoryName ?? 'industrial equipment')
    .replace(/\{pageUrl\}/g, pageUrl);
}
