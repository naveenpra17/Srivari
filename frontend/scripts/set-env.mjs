/**
 * Generates environment.prod.ts from Vercel / CI environment variables before build.
 * Usage: API_URL=https://your-api.onrender.com/api/v1 node scripts/set-env.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../src/environments/environment.prod.ts');

const apiUrl = process.env.API_URL || '/api/v1';
const appName = process.env.APP_NAME || 'Sri Vaari';
const tagline = process.env.APP_TAGLINE || 'Where Innovation Meets Reliability';
const whatsappPhone = process.env.WHATSAPP_PHONE || '919876543210';

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  appName: '${appName}',
  tagline: '${tagline}',
  whatsapp: {
    enabled: true,
    provider: 'whatsapp' as const,
    phone: '${whatsappPhone}',
    tooltip: 'Chat with us on WhatsApp',
    messages: {
      general: 'Hello, I would like to know more about your products.',
      product: 'Hello, I am interested in {productName}. Please share more details.',
      contact: 'Hello, I would like to get in touch with Sri Vaari.'
    }
  }
};
`;

writeFileSync(outPath, content, 'utf8');
console.log(`[set-env] Wrote environment.prod.ts with apiUrl=${apiUrl}`);
