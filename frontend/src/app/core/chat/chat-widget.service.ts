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
  general:
    'Hi Sri Vaari team, I am browsing your website and would like help choosing the right motor or pump. Could you guide me?',
  product:
    'Hi, I am interested in *{productName}* ({categoryName}). Could you share pricing, availability, and specifications?\n\nPage: {pageUrl}',
  contact:
    'Hi, I found your contact details and would like to speak with your sales team about an inquiry.'
};

@Injectable({ providedIn: 'root' })
export class ChatWidgetService {
  private readonly publicService = inject(PublicService);
  private readonly router = inject(Router);
  private readonly whatsappProvider = inject(WhatsappChatProvider);

  private readonly settings = signal<SiteSettings>({});
  private readonly pageContext = signal<ChatPageContext>({ type: 'general' });
  private readonly isPublicRoute = signal(true);
  private readonly panelOpen = signal(false);

  readonly assistantVisible = computed(() => this.isPublicRoute());
  readonly visible = computed(() => this.isPublicRoute() && this.config().enabled);
  readonly tooltip = computed(() => this.config().tooltip);
  readonly isPanelOpen = this.panelOpen.asReadonly();

  readonly greeting = computed(() => {
    const ctx = this.pageContext();
    if (ctx.type === 'product' && ctx.productName) {
      return `Questions about ${ctx.productName}?`;
    }
    if (ctx.type === 'contact') {
      return 'Ready to connect with our team?';
    }
    return 'How can we help you today?';
  });

  readonly subheading = computed(() => {
    const ctx = this.pageContext();
    if (ctx.type === 'product') {
      return 'Get a quote, check specs, or chat with our sales team on WhatsApp.';
    }
    return 'Browse products, request a quote, or reach us directly.';
  });

  readonly companyPhone = computed(() => {
    const s = this.settings();
    const envPhone = environment.whatsapp?.phone ?? '';
    return (s['company_phone'] || s['whatsapp_phone'] || envPhone).trim();
  });

  readonly telLink = computed(() => {
    const phone = this.normalizePhone(this.companyPhone());
    return phone ? `tel:+${phone}` : '';
  });

  readonly config = computed<ChatWidgetConfig>(() => {
    const s = this.settings();
    const env = environment.whatsapp;
    const provider = (s['chat_provider'] || env?.provider || 'whatsapp') as ChatProviderType;
    const enabledSetting = s['chat_widget_enabled'];
    const enabled = enabledSetting !== undefined
      ? enabledSetting === 'true'
      : (env?.enabled ?? true);

    const phone = (s['whatsapp_phone'] || s['company_phone'] || env?.phone || '').trim();
    const tooltip = s['whatsapp_tooltip'] || env?.tooltip || 'Need help? Chat with us';

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
      this.panelOpen.set(false);
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
    this.pageContext.set({
      ...context,
      pageUrl: context.pageUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined)
    });
  }

  togglePanel(): void {
    this.panelOpen.update(open => !open);
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  openChat(): void {
    const config = this.config();
    const provider = this.resolveProvider(config.provider);
    if (!provider) return;
    this.closePanel();
    provider.openChat(config, this.pageContext());
  }

  browseProducts(): void {
    this.closePanel();
    void this.router.navigate(['/products']);
  }

  requestQuote(): void {
    this.closePanel();
    const ctx = this.pageContext();
    if (ctx.type === 'product' && ctx.productSlug) {
      void this.router.navigate(['/products', ctx.productSlug], { fragment: 'quote' });
      return;
    }

    const url = this.router.url.split('?')[0].split('#')[0];
    const productMatch = url.match(/^\/products\/([^/]+)/);
    if (productMatch?.[1]) {
      void this.router.navigate(['/products', productMatch[1]], { fragment: 'quote' });
      return;
    }

    void this.router.navigate(['/'], { fragment: 'contact' });
  }

  goToContact(): void {
    this.closePanel();
    void this.router.navigate(['/'], { fragment: 'contact' });
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
    const path = url.split('?')[0].split('#')[0];
    if (url.includes('#contact')) return { type: 'contact' };

    const productMatch = path.match(/^\/products\/([^/]+)/);
    if (productMatch?.[1]) {
      const slug = decodeURIComponent(productMatch[1]);
      return {
        type: 'product',
        productSlug: slug,
        productName: slug.replace(/-/g, ' ')
      };
    }

    if (path.startsWith('/products')) return { type: 'general' };
    return { type: 'general' };
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
