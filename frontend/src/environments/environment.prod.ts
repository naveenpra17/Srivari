export const environment = {
  production: true,
  apiUrl: 'https://srivari-1.onrender.com/api/v1',
  appName: 'Sri Vaari Traders',
  tagline: 'Where Innovation Meets Reliability',
  whatsapp: {
    enabled: true,
    provider: 'whatsapp' as const,
    phone: '919842231111',
    tooltip: 'Need help? We are here for you',
    messages: {
      general:
        'Hi Sri Vaari team, I am browsing your website and would like help choosing the right motor or pump. Could you guide me?',
      product:
        'Hi, I am interested in *{productName}* ({categoryName}). Could you share pricing, availability, and specifications?\n\nPage: {pageUrl}',
      contact:
        'Hi, I found your contact details and would like to speak with your sales team about an inquiry.'
    }
  }
};
