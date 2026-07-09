# Motors Industries - Full Stack Website

Production-ready industrial motors company website built with **Spring Boot** and **Angular 20**.

## Architecture

```
motors/
├── backend/          # Spring Boot REST API (Java 21)
├── frontend/         # Angular 20 SPA
├── database/         # PostgreSQL schema & seed data
├── docs/             # Deployment guides
└── .github/          # CI/CD workflows
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.4, Spring Security, JWT, JPA, MapStruct |
| Frontend | Angular 20, Bootstrap 5, Angular Material, Signals, RxJS |
| Database | PostgreSQL (Supabase) |
| Images | Cloudinary |
| Hosting | Render (Docker API) + Vercel (Frontend) |

## Quick Start (Local)

### Prerequisites
- Java 21 JDK
- Node.js 20+
- PostgreSQL 15+

### Database
```bash
psql -U postgres -c "CREATE DATABASE motors_db;"
psql -U postgres -d motors_db -f database/schema.sql
psql -U postgres -d motors_db -f database/seed.sql
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
# API: http://localhost:8080/api
# Swagger: http://localhost:8080/api/swagger-ui.html
```

### Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:4200
```

### Default Admin Credentials
- **Email:** admin@motors.com
- **Password:** Admin@123

## Environment Variables

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | Supabase connection URL |
| `DATABASE_USERNAME` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `JWT_SECRET` | 256-bit secret key |
| `CORS_ALLOWED_ORIGINS` | Vercel frontend URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `API_URL` | Render backend URL (e.g. `https://motors-backend.onrender.com/api/v1`) |
| `APP_NAME` | Optional app display name |
| `WHATSAPP_PHONE` | Optional default WhatsApp number |

Set in Vercel → Project → Environment Variables. The build script (`scripts/set-env.mjs`) writes these into `environment.prod.ts` automatically.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/v1/auth/login` | Public | Login |
| GET | `/v1/public/home` | Public | Homepage data |
| GET | `/v1/products` | Public | List products |
| POST | `/v1/contact` | Public | Submit contact form |
| GET | `/v1/admin/dashboard` | JWT | Dashboard stats |
| POST | `/v1/admin/upload` | JWT | Upload image |

Full API documentation available at `/api/swagger-ui.html` when backend is running.

## Phase 4 Features

| Feature | Description |
|---------|-------------|
| **SEO** | Dynamic meta tags, Open Graph, and Twitter cards via `SeoService` on all public pages |
| **Dark mode** | Theme toggle in header with `localStorage` persistence and system preference detection |
| **Product gallery** | Multi-image gallery with thumbnails on product detail pages |
| **Audit logs** | Admin-only audit log viewer at `/admin/audit-logs` (product CRUD actions logged) |
| **HTML emails** | Contact and quote notification emails sent as styled HTML templates |
| **Performance** | `NgOptimizedImage`, cache-control headers on public APIs, image preconnect hints |

## Phase 5 Features

| Feature | Description |
|---------|-------------|
| **Sitemap & robots** | Dynamic `GET /v1/public/sitemap.xml` and `GET /v1/public/robots.txt` on the API |
| **Admin dark mode** | Theme toggle in admin topbar; admin panels use CSS variable theming |
| **Product image CRUD** | Gallery management in admin products (`/products/{id}/images` API) |
| **Expanded audit logs** | All admin mutations (categories, industries, gallery, users, settings, etc.) are logged |
| **PWA** | Service worker caches app shell for faster repeat visits (production builds only) |

### SEO / Sitemap environment variables (Backend)

| Variable | Description |
|----------|-------------|
| `SITE_FRONTEND_URL` | Public site URL for sitemap entries (e.g. `https://yoursite.vercel.app`) |
| `SITE_API_URL` | API base URL for robots.txt sitemap reference (e.g. `https://your-api.onrender.com/api`) |

## Responsive Design & WhatsApp Chat

- **Mobile-first** layout with responsive typography, grids, and touch-friendly controls (44px minimum tap targets)
- **Hamburger navigation** on tablets/phones with scroll-lock when open
- **Admin drawer sidebar** on mobile with overlay
- **Floating WhatsApp button** on all public pages — configurable in Admin → Settings
- **Future-ready chat architecture** — swap `chat_provider` to `tawk`, `crisp`, or `intercom` via `ChatWidgetService.registerProvider()`

### WhatsApp settings (Admin → Settings)

| Key | Description |
|-----|-------------|
| `chat_widget_enabled` | `true` / `false` |
| `whatsapp_phone` | Digits only (falls back to `company_phone`) |
| `whatsapp_message_general` | Default pre-filled message |
| `whatsapp_message_product` | Product page message (`{productName}` placeholder) |
| `whatsapp_message_contact` | Contact section message |

Run `database/migrations/002_chat_whatsapp_settings.sql` on existing databases.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## License

Proprietary - Motors Industries
