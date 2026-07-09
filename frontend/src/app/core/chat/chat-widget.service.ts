import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PublicService } from '../services/public.service';
import { SiteSettings } from '../../models';
import {
  ChatMessageContext,
  ChatPageContext,
  ChatProvider,
  ChatProviderType,
  ChatWidgetConfig
} from './chat.types';
import { WhatsappChatProvider } from './providers/whatsapp-chat.provider';

const DEFAULT_MESSAGES: Record<ChatMessageContext, string> = {
  general: 'Hello, I would like to know more about your products.',
  product: 'Hello, I am interested in {productName}. Please share more details.',
  contact: 'Hello, I would like to get in touch with Motors Industries.'
};

@Injectable({ providedIn: 'root' })
export class ChatWidgetService {
  private readonly publicService = inject(PublicService);
  private readonly router = inject(Router);
  private readonly whatsappProvider = inject(WhatsappChatProvider);

  private readonly settings = signal<SiteSettings>({});
  private readonly pageContext = signal<ChatPageContext>({ type: 'general' });
  private readonly isPublicRoute = signal(true);

  readonly visible = computed(() => this.isPublicRoute() && this.config().enabled);
  readonly tooltip = computed(() => this.config().tooltip);

  readonly config = computed<ChatWidgetConfig>(() => {
    const s = this.settings();
    const env = environment.whatsapp;
    const provider = (s['chat_provider'] || env?.provider || 'whatsapp') as ChatProviderType;
    const enabledSetting = s['chat_widget_enabled'];
    const enabled = enabledSetting !== undefined
      ? enabledSetting === 'true'
      : (env?.enabled ?? true);

    const phone = (s['whatsapp_phone'] || s['company_phone'] || env?.phone || '').trim();
    const tooltip = s['whatsapp_tooltip'] || env?.tooltip || 'Chat with us on WhatsApp';

    return {
      enabled: enabled && provider !== 'none' && !!this.normalizePhone(phone),
      provider,
      tooltip,
      phone,
      messages: {
        general: s['whatsapp_message_general'] || env?.messages?.general || DEFAULT_MESSAGES.general,
        product: s['whatsapp_message_product'] || env?.messages?.product || DEFAULT_MESSAGES.product,
        contact: s['whatsapp_message_contact'] || env?.messages?.contact || DEFAULT_MESSAGES.contact
      }
    };
  });

  constructor() {
    this.loadSettings();
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(event => {
      this.isPublicRoute.set(!event.urlAfterRedirects.startsWith('/admin'));
      this.pageContext.set(this.inferContextFromUrl(event.urlAfterRedirects));
    });
  }

  loadSettings(): void {
    this.publicService.getSettings().subscribe({
      next: (res) => this.settings.set(res.data),
      error: () => this.settings.set({})
    });
  }

  setPageContext(context: ChatPageContext): void {
    this.pageContext.set(context);
  }

  openChat(): void {
    const config = this.config();
    const provider = this.resolveProvider(config.provider);
    if (!provider) return;
    provider.openChat(config, this.pageContext());
  }

  /**
   * Register additional providers (Tawk.to, Crisp, Intercom) without changing the widget UI.
   */
  registerProvider(provider: ChatProvider): void {
    this.providers.set(provider.type, provider);
  }

  private readonly providers = new Map<ChatProviderType, ChatProvider>([
    ['whatsapp', this.whatsappProvider]
  ]);

  private resolveProvider(type: ChatProviderType): ChatProvider | null {
    const provider = this.providers.get(type);
    if (!provider?.isSupported()) return null;
    return provider;
  }

  private inferContextFromUrl(url: string): ChatPageContext {
    if (url.includes('#contact')) return { type: 'contact' };
    const productMatch = url.match(/^\/products\/([^/?#]+)/);
    if (productMatch && productMatch[1] !== '') {
      return { type: 'product', productName: decodeURIComponent(productMatch[1]).replace(/-/g, ' ') };
    }
    if (url.startsWith('/products')) return { type: 'general' };
    return { type: 'general' };
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
