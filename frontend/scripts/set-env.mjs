/**
 * Generates environment.prod.ts from Vercel / CI environment variables before build.
 * Usage: API_URL=https://your-api.onrender.com/api/v1 node scripts/set-env.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../src/environments/environment.prod.ts');

const apiUrl = process.env.API_URL || 'https://srivari-1.onrender.com/api/v1';
const appName = process.env.APP_NAME || 'Sri Vaari Traders';
const tagline = process.env.APP_TAGLINE || 'Where Innovation Meets Reliability';
const whatsappPhone = process.env.WHATSAPP_PHONE || '919842231111';

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  appName: '${appName}',
  tagline: '${tagline}',
  whatsapp: {
    enabled: true,
    provider: 'whatsapp' as const,
    phone: '${whatsappPhone}',
    tooltip: 'Need help? We are here for you',
    messages: {
      general:
        'Hi Sri Vaari team, I am browsing your website and would like help choosing the right motor or pump. Could you guide me?',
      product:
        'Hi, I am interested in *{productName}* ({categoryName}). Could you share pricing, availability, and specifications?\\n\\nPage: {pageUrl}',
      contact:
        'Hi, I found your contact details and would like to speak with your sales team about an inquiry.'
    }
  }
};
`;

writeFileSync(outPath, content, 'utf8');
console.log(`[set-env] Wrote environment.prod.ts with apiUrl=${apiUrl}`);
