export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  appName: 'Motors Industries',
  tagline: 'Where Innovation Meets Reliability',
  whatsapp: {
    enabled: true,
    provider: 'whatsapp' as const,
    phone: '919876543210',
    tooltip: 'Chat with us on WhatsApp',
    messages: {
      general: 'Hello, I would like to know more about your products.',
      product: 'Hello, I am interested in {productName}. Please share more details.',
      contact: 'Hello, I would like to get in touch with Motors Industries.'
    }
  }
};
