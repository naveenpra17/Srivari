# Sri Vaari Traders — User Manual

Complete guide to the **Sri Vaari Traders** industrial motors & pumps website and admin panel.

| Item | Value |
|------|-------|
| **Public website** | https://srivari-ui.vercel.app |
| **Admin panel** | https://srivari-ui.vercel.app/admin/login |
| **API** | https://srivari-1.onrender.com/api/v1 |
| **API docs (Swagger)** | https://srivari-1.onrender.com/api/swagger-ui.html |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Public Website — Visitor Guide](#2-public-website--visitor-guide)
3. [Help Assistant & WhatsApp](#3-help-assistant--whatsapp)
4. [Admin Panel — Getting Started](#4-admin-panel--getting-started)
5. [Admin Panel — Page-by-Page Guide](#5-admin-panel--page-by-page-guide)
6. [User Roles & Permissions](#6-user-roles--permissions)
7. [Site Settings Reference](#7-site-settings-reference)
8. [Email Notifications](#8-email-notifications)
9. [SEO, Performance & Accessibility](#9-seo-performance--accessibility)
10. [Technical Architecture](#10-technical-architecture)
11. [Local Development](#11-local-development)
12. [Deployment & Environment](#12-deployment--environment)
13. [Troubleshooting](#13-troubleshooting)
14. [Feature Checklist](#14-feature-checklist)

---

## 1. Overview

Sri Vaari Traders is a full-stack industrial equipment website with:

- A **public marketing site** — product catalog, testimonials, contact forms, quote requests
- An **admin CMS** — manage products, content, messages, quotes, users, and settings
- A **REST API** — Spring Boot backend with JWT authentication
- **Integrations** — Cloudinary (images), Brevo (email), WhatsApp (chat), Google Maps

### What visitors can do

- Browse products and categories
- View specifications, galleries, and brochures
- Request quotes
- Submit contact messages
- Read customer testimonials
- Chat on WhatsApp or call directly
- Switch between light and dark theme

### What staff can do (admin)

- Manage the entire product catalog and images
- Update homepage content (hero, stats, industries, gallery, testimonials)
- Respond to contact messages and quote requests
- View analytics dashboards with charts
- Configure company info, social links, and chat settings
- Manage admin users and view audit logs (admin only)

---

## 2. Public Website — Visitor Guide

### 2.1 Global layout

Every public page includes:

| Element | Description |
|---------|-------------|
| **Header** | Logo, navigation, product search, phone link, theme toggle, mobile menu |
| **Main content** | Page-specific content with smooth route animations |
| **Footer** | Company info, quick links, social media, legal links |
| **Help button** | Floating “Help” panel (bottom-right) — see [Section 3](#3-help-assistant--whatsapp) |
| **Scroll to top** | Appears after scrolling down |

**Navigation links**

| Link | Destination |
|------|-------------|
| Home | `/` |
| Products | `/products` |
| Industries | `/#industries` (homepage section) |
| About | `/about` |
| Contact | `/#contact` (homepage section) |

**Header search** — Type a product name and press Enter to search. Results open at `/products?q=your-search`.

**Theme toggle** — Switch between light and dark mode. Your preference is saved in the browser.

---

### 2.2 Home page (`/`)

A single-page experience with scrollable sections:

| Section | What it shows | Visitor actions |
|---------|---------------|-----------------|
| **Hero slider** | Rotating banners with headlines, images, and call-to-action buttons | Click CTAs to browse products or contact |
| **Categories** | Product category cards with images or letter placeholders | Click a category → filtered product list |
| **Stats** | Animated counters (years of experience, clients, products, countries) | Scroll-triggered animation |
| **About** | Mission, vision, history from site settings | Read company overview |
| **Industries** | Industries served with icons/images | Browse industries served |
| **Testimonials** | Featured customer stories | Open full story or testimonials page |
| **Gallery** | Photo grid from admin gallery | View project/installation photos |
| **Contact** | Contact form + Google Maps embed | Submit inquiry |

**Contact form fields:** Name, Email, Phone (optional), Subject, Message.

After submission you receive a confirmation. The message appears in **Admin → Messages**.

---

### 2.3 Products catalog (`/products`)

| Feature | Details |
|---------|---------|
| **Search** | Debounced text search by product name/description |
| **Category filter** | `?categoryId=123` from category cards |
| **Search query** | `?q=motor` from header search |
| **Pagination** | 12 products per page |
| **Product cards** | Image, name, short description, “View Details” |

**Actions:** Click a product → product detail page.

---

### 2.4 Product detail (`/products/:slug`)

| Feature | Details |
|---------|---------|
| **Breadcrumb** | Home → Products → Product name |
| **Image gallery** | Main image + thumbnail strip |
| **Lightbox** | Click image to open fullscreen viewer |
| **Lightbox controls** | Zoom (scroll/double-click), pan (drag), swipe (mobile), arrow keys, Escape to close |
| **Specifications** | Key-value table from product data |
| **Price** | Displayed in INR when set |
| **Brochure** | Download button when brochure URL is configured |
| **Quote form** | Name, email, phone, company, quantity, message |

**Quote form actions**

1. Click **Request Quote** on the product page, or
2. Use the **Help** panel → **Request a quote**, or
3. Open a direct link with `#quote` fragment (e.g. `/products/induction-motor#quote`)

Quotes are sent to **Admin → Quote Requests**. Staff may receive an email notification.

**WhatsApp context** — On product pages, the Help panel and WhatsApp message automatically include the product name and category.

---

### 2.5 Testimonials (`/testimonials`)

| Feature | Details |
|---------|---------|
| **Featured stories** | Top 3 highlighted at top |
| **Search** | By client name, company, or story text |
| **Filters** | Category, minimum rating (3+, 4+, 5) |
| **Sort** | Latest, oldest, most popular |
| **Load more** | Paginated loading |
| **Like** | Heart/like button (once per browser session) |

**Testimonial detail** (`/testimonials/:slug`)

- Full customer story with rating, image, optional video
- Share via Twitter, LinkedIn, or copy link
- Related testimonials at bottom

---

### 2.6 Static pages

| Page | URL | Content |
|------|-----|---------|
| About | `/about` | Company overview |
| Privacy Policy | `/privacy` | Data collection and usage policy |
| Terms of Service | `/terms` | Website terms and liability |
| 404 Not Found | Any invalid URL | Error page with link back home |

---

## 3. Help Assistant & WhatsApp

### 3.1 Help panel (guided assistant)

Click the blue **Help** button (bottom-right on all public pages).

The panel shows a context-aware greeting:

| Page context | Example greeting |
|--------------|------------------|
| Product page | “Questions about [Product Name]?” |
| Contact section | “Ready to connect with our team?” |
| Other pages | “How can we help you today?” |

**Actions in the panel**

| Button | What it does |
|--------|--------------|
| **Browse products** | Opens `/products` |
| **Request a quote** | Opens product quote form (`#quote`) or homepage contact (`#contact`) |
| **Chat on WhatsApp** | Opens WhatsApp with a pre-filled message |
| **Call us** | Opens phone dialer with company number |

Press **Escape** or the **X** button to close the panel.

### 3.2 WhatsApp messages

Pre-filled messages are configurable in **Admin → Settings**. Default templates support these placeholders:

| Placeholder | Replaced with |
|-------------|---------------|
| `{productName}` | Product name |
| `{categoryName}` | Product category |
| `{pageUrl}` | Current page URL |
| `{productSlug}` | Product URL slug |

**Example product message:**
> Hi, I am interested in *5 HP Induction Motor* (Industrial Motors). Could you share pricing, availability, and specifications?
>
> Page: https://srivari-ui.vercel.app/products/5-hp-induction-motor

### 3.3 Chat settings (admin)

Configure under **Admin → Settings → WhatsApp & Chat Widget**:

| Setting key | Description | Example |
|-------------|-------------|---------|
| `chat_widget_enabled` | Show/hide WhatsApp in help panel | `true` |
| `chat_provider` | Provider type (future: tawk, crisp, intercom) | `whatsapp` |
| `whatsapp_phone` | WhatsApp number (digits only) | `919842231111` |
| `whatsapp_tooltip` | Help button tooltip | `Need help? We are here for you` |
| `whatsapp_message_general` | Default site-wide message | Custom text |
| `whatsapp_message_product` | Product page message | Uses `{productName}`, `{categoryName}`, `{pageUrl}` |
| `whatsapp_message_contact` | Contact-related message | Custom text |

Falls back to `company_phone` if `whatsapp_phone` is empty.

---

## 4. Admin Panel — Getting Started

### 4.1 Logging in

1. Go to **https://srivari-ui.vercel.app/admin/login**
2. Enter email and password
3. You are redirected to the **Dashboard**

**Default credentials (change after first login):**

| Field | Value |
|-------|-------|
| Email | `admin@motors.com` |
| Password | `Admin@123` |

### 4.2 Admin layout

| Area | Description |
|------|-------------|
| **Sidebar** | Navigation to all admin pages (items vary by role) |
| **Top bar** | Welcome message, theme toggle, “View Site”, logout |
| **Main area** | Page content |

**Mobile:** Sidebar becomes a drawer with overlay.

**View Site** — Opens the public website in a new tab.

---

## 5. Admin Panel — Page-by-Page Guide

### 5.1 Dashboard (`/admin/dashboard`)

**Purpose:** Overview of site health and activity.

**Stat cards**

- Total products, categories, industries, testimonials, gallery items
- Unread contact messages
- Total users

**Charts (Chart.js)**

| Chart | Shows |
|-------|-------|
| Products by category | Bar chart of product counts per category |
| Product status | Active vs inactive products |
| Monthly inquiries | Contact + quote submissions over time |
| Top industries | Most-used industries |

**Actions:** View only — no editing on this page.

---

### 5.2 Products (`/admin/products`)

**Purpose:** Manage the product catalog.

**List view**

- Paginated table (20 per page)
- Shows name, category, price, featured/active status

**Create / Edit product**

| Field | Description |
|-------|-------------|
| Name | Product display name |
| Slug | URL-friendly identifier (auto-generated from name) |
| Category | Product category |
| Short description | Card/listing text |
| Description | Full product description |
| Image URL | Primary image (or upload) |
| Brochure URL | PDF/document download link |
| Price | Price in INR |
| Specifications | Key-value technical specs (JSON) |
| Featured | Show on homepage |
| Active | Visible on public site |
| Sort order | Display order within category |

**Product image gallery**

- Add multiple images per product
- Set primary image
- Delete images
- **Drag and drop** to reorder images

**Image upload**

- Use the upload button to send images to **Cloudinary**
- Images are stored under `motors/{folder}` on Cloudinary CDN

**Delete product** — Admin role only.

---

### 5.3 Categories (`/admin/categories`)

**Purpose:** Organize products into categories (shown on homepage and product filters).

| Field | Description |
|-------|-------------|
| Name | Category name |
| Description | Optional description |
| Image URL | Category card image (optional — shows letter placeholder if empty) |
| Sort order | Display order on homepage |
| Active | Show/hide on public site |

**Drag and drop** — Reorder categories on the list.

**Delete** — Admin role only.

---

### 5.4 Industries (`/admin/industries`)

**Purpose:** Industries served section on the homepage.

| Field | Description |
|-------|-------------|
| Name | Industry name |
| Description | Short description |
| Icon | Icon identifier or URL |
| Image URL | Industry card image |
| Sort order | Display order |
| Active | Show/hide |

**Delete** — Admin role only.

---

### 5.5 Gallery (`/admin/gallery`)

**Purpose:** Homepage photo gallery.

| Field | Description |
|-------|-------------|
| Title | Image title |
| Description | Optional caption |
| Image URL | Photo URL (upload supported) |
| Category tag | Grouping label |
| Sort order | Display order |
| Active | Show/hide |

**Delete** — Admin role only.

---

### 5.6 Testimonials (`/admin/testimonials`)

**Purpose:** Customer stories and reviews.

| Field | Description |
|-------|-------------|
| Client name | Customer name |
| Designation | Job title |
| Company | Company name |
| Category | Story category |
| Content | Short quote |
| Full story | Long-form testimonial |
| Image URL | Customer/company photo |
| Video URL | Optional video link |
| Slug | URL for detail page |
| Rating | 1–5 stars |
| Likes | Like count (can be set manually) |
| Featured | Show on homepage |
| Verified | Show verified badge |
| Active | Show/hide |
| Sort order | Display order |

**Delete** — Admin role only.

---

### 5.7 Hero Slider (`/admin/hero-slider`)

**Purpose:** Homepage banner carousel.

| Field | Description |
|-------|-------------|
| Title | Main headline |
| Subtitle | Secondary headline |
| Description | Supporting text |
| Image URL | Banner background image |
| Video URL | Optional video background |
| Primary CTA text | Main button label |
| Primary CTA link | Main button URL |
| Secondary CTA text | Second button label |
| Secondary CTA link | Second button URL |
| Sort order | Slide order |
| Active | Show/hide slide |
| Publish at | Optional scheduled publish date |

**Delete** — Admin role only.

---

### 5.8 Site Settings (`/admin/settings`)

**Purpose:** Global configuration for the entire website.

See [Section 7](#7-site-settings-reference) for all setting keys.

Click **Save All Settings** to apply changes. Chat widget settings refresh immediately after save.

---

### 5.9 Contact Messages (`/admin/messages`)

**Purpose:** Inbox for public contact form submissions.

| Action | Description |
|--------|-------------|
| **View list** | Paginated messages with read/unread status |
| **Open message** | View full details (name, email, phone, subject, message, date) |
| **Auto mark read** | Opening a message marks it as read |
| **Delete** | Admin role only |

---

### 5.10 Quote Requests (`/admin/quotes`)

**Purpose:** Product quote requests from the public site.

| Action | Description |
|--------|-------------|
| **View list** | Paginated quotes with product name, contact info, quantity |
| **Open detail** | Full quote details in a modal |
| **Auto mark read** | Opening marks as read |
| **Delete** | Admin role only |

---

### 5.11 Users (`/admin/users`) — Admin only

**Purpose:** Manage admin panel user accounts.

| Action | Description |
|--------|-------------|
| **List users** | All admin users with roles |
| **Create user** | Email, password, name, phone, roles, active status |
| **Edit user** | Update details (password optional on edit) |
| **Assign roles** | ADMIN, EDITOR, or VIEWER |
| **Delete user** | Remove user account |

---

### 5.12 Audit Logs (`/admin/audit-logs`) — Admin only

**Purpose:** Track all admin changes for accountability.

| Column | Description |
|--------|-------------|
| Action | CREATE, UPDATE, or DELETE |
| Entity type | Product, Category, User, Setting, etc. |
| Entity ID | Database record ID |
| User | Who made the change |
| IP address | Request origin |
| Timestamp | When it happened |

**Detail view** — Shows old and new JSON values for the changed record.

Logged actions include: products, categories, industries, gallery, testimonials, hero slides, users, settings, and more.

---

### 5.13 My Profile (`/admin/profile`)

**Purpose:** Manage your own admin account.

| Action | Description |
|--------|-------------|
| **Update profile** | First name, last name, phone, avatar (image upload) |
| **Change password** | Current password + new password + confirm |

---

## 6. User Roles & Permissions

| Permission | ADMIN | EDITOR | VIEWER |
|------------|:-----:|:------:|:------:|
| View dashboard & stats | ✅ | ✅ | ✅ |
| View messages & quotes | ✅ | ✅ | ✅ |
| Mark messages/quotes read | ✅ | ✅ | ❌ |
| Create/edit content | ✅ | ✅ | ❌ |
| Delete content | ✅ | ❌ | ❌ |
| Upload images | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |
| Edit site settings | ✅ | ✅ | ❌ |

**VIEWER** users see a “Read Only” notice and cannot access content management navigation items.

---

## 7. Site Settings Reference

### Company information

| Key | Used for |
|-----|----------|
| `company_name` | Site title, footer, emails |
| `company_tagline` | Tagline under company name |
| `company_phone` | Header, footer, contact, call button |
| `company_email` | Footer, contact section |
| `company_address` | Footer, contact section |
| `company_working_hours` | Contact section |

### Homepage statistics

| Key | Display |
|-----|---------|
| `years_experience` | Stats counter |
| `happy_clients` | Stats counter |
| `products_delivered` | Stats counter |
| `countries_served` | Stats counter |

### About section

| Key | Content |
|-----|---------|
| `about_mission` | Mission statement |
| `about_vision` | Vision statement |
| `about_history` | Company history |
| `about_achievements` | Key achievements |

### Social media

| Key | Platform |
|-----|----------|
| `facebook_url` | Facebook |
| `linkedin_url` | LinkedIn |
| `twitter_url` | Twitter/X |
| `instagram_url` | Instagram |

### Maps

| Key | Description |
|-----|-------------|
| `google_maps_embed` | Google Maps iframe embed URL for contact section |

### Chat / WhatsApp

See [Section 3.3](#33-chat-settings-admin).

---

## 8. Email Notifications

When configured with **Brevo** (formerly Sendinblue), the system sends HTML emails for:

| Event | Recipient | Content |
|-------|-----------|---------|
| New contact message | Admin email | Styled notification with sender details |
| New quote request | Admin email | Product name, quantity, contact info |

Email templates are in the backend (`EmailTemplateService`). Requires these backend environment variables:

- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `ADMIN_NOTIFICATION_EMAIL`

---

## 9. SEO, Performance & Accessibility

### SEO

| Feature | Description |
|---------|-------------|
| **Dynamic meta tags** | Title, description, keywords per page via `SeoService` |
| **Open Graph** | Social sharing previews (Facebook, LinkedIn) |
| **Twitter cards** | Twitter sharing previews |
| **Sitemap** | `GET /v1/public/sitemap.xml` — auto-generated from products, testimonials, pages |
| **Robots.txt** | `GET /v1/public/robots.txt` — search engine directives |

**Backend env vars for sitemap:**

- `SITE_FRONTEND_URL` — Public site URL
- `SITE_API_URL` — API base URL

### Performance

| Feature | Description |
|---------|-------------|
| **Lazy loading** | Routes and images load on demand |
| **NgOptimizedImage** | Optimized image loading |
| **API caching** | Cache-control headers on public endpoints |
| **PWA** | Service worker caches app shell (production builds) |
| **Preconnect hints** | Faster image CDN loading |

### Accessibility

| Feature | Description |
|---------|-------------|
| **Landmarks** | Proper `<main>`, navigation, and heading structure |
| **ARIA labels** | Buttons, forms, lightbox, star ratings |
| **Keyboard navigation** | Lightbox, thumbnails, mobile menu |
| **Contrast** | WCAG-compliant color contrast |
| **Touch targets** | Minimum 44px tap targets on mobile |
| **Audit script** | Run `npm run a11y` in `frontend/` for automated checks |

### Animations

| Feature | Description |
|---------|-------------|
| **Route transitions** | Smooth page change animations |
| **Scroll reveals** | Sections fade/slide in on scroll |
| **Hero animations** | Staggered headline and CTA entrance |
| **Stats counters** | Animated number count-up on scroll |

---

## 10. Technical Architecture

```
motors/
├── backend/          Spring Boot REST API (Java 21)
├── frontend/         Angular 20 SPA
├── database/         PostgreSQL schema, seed data, migrations
├── docs/             Documentation (this manual, deployment, API)
└── .github/          CI/CD workflows
```

### Tech stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.4, Spring Security, JWT, JPA, MapStruct |
| Frontend | Angular 20, Bootstrap 5, Angular Material, Signals, RxJS, Chart.js |
| Database | PostgreSQL (Supabase) |
| Images | Cloudinary CDN |
| Email | Brevo |
| Hosting | Render (API) + Vercel (frontend) |

### Main API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/v1/auth/login` | Public | Admin login |
| POST | `/v1/auth/refresh` | Public | Refresh JWT token |
| GET | `/v1/public/home` | Public | Homepage data bundle |
| GET | `/v1/public/settings` | Public | Site settings |
| GET | `/v1/public/sitemap.xml` | Public | XML sitemap |
| GET | `/v1/public/robots.txt` | Public | Robots file |
| GET | `/v1/products` | Public | Product list (search, filter, paginate) |
| GET | `/v1/products/{slug}` | Public | Product detail |
| POST | `/v1/contact` | Public | Submit contact form |
| POST | `/v1/quotes` | Public | Submit quote request |
| GET | `/v1/admin/dashboard` | JWT | Dashboard stats |
| GET | `/v1/admin/messages` | JWT | Contact messages |
| GET | `/v1/admin/quotes` | JWT | Quote requests |
| POST | `/v1/admin/upload` | JWT | Image upload to Cloudinary |
| GET | `/v1/admin/audit-logs` | JWT (Admin) | Audit log list |

Full interactive API documentation: **Swagger UI** at `/api/swagger-ui.html`.

A Postman collection is available at `docs/postman/Motors-API.postman_collection.json`.

---

## 11. Local Development

### Prerequisites

- Java 21 JDK
- Node.js 20+
- PostgreSQL 15+ (or Supabase)

### Database setup

```bash
psql -U postgres -c "CREATE DATABASE motors_db;"
psql -U postgres -d motors_db -f database/schema.sql
psql -U postgres -d motors_db -f database/seed.sql
```

Run migrations in `database/migrations/` for existing databases.

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

The dev server proxies API calls to the configured backend (`proxy.conf.json`).

### Useful scripts

| Command | Location | Purpose |
|---------|----------|---------|
| `npm start` | `frontend/` | Dev server with hot reload |
| `npm run build` | `frontend/` | Production build |
| `npm run a11y` | `frontend/` | Accessibility audit |
| `node run-smoke-test.mjs` | `frontend/` | API smoke tests |

---

## 12. Deployment & Environment

See **[docs/DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step deployment to Supabase, Render, Vercel, and Cloudinary.

See **[docs/ENVIRONMENT.md](ENVIRONMENT.md)** for environment variable reference.

### Quick reference — Backend (Render)

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | Supabase connection URL |
| `JWT_SECRET` | 256-bit secret key |
| `CORS_ALLOWED_ORIGINS` | Frontend URL(s) |
| `CLOUDINARY_*` | Cloudinary credentials |
| `BREVO_*` | Email service credentials |
| `SITE_FRONTEND_URL` | Public site URL for sitemap |

### Quick reference — Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `API_URL` | Backend API URL |
| `APP_NAME` | Display name |
| `WHATSAPP_PHONE` | Default WhatsApp number |

---

## 13. Troubleshooting

| Problem | Solution |
|---------|----------|
| **Admin login returns 403 CORS** | Add `http://localhost:4200` to `CORS_ALLOWED_ORIGINS` on Render |
| **WhatsApp button not showing** | Set `chat_widget_enabled=true` and `whatsapp_phone` in Settings |
| **Images not uploading** | Verify Cloudinary env vars on Render |
| **Emails not sending** | Check Brevo API key and sender email verification |
| **Categories show letter instead of image** | Upload image in Admin → Categories, or leave empty for placeholder |
| **Quote form doesn’t scroll** | Use Help panel → Request a quote, or add `#quote` to product URL |
| **Render API slow on first request** | Free tier cold start — wait 30–60 seconds |
| **Dark mode not persisting** | Clear browser localStorage and try again |

---

## 14. Feature Checklist

Everything included in the current release:

### Public website
- [x] Responsive homepage with 8 sections
- [x] Hero slider with CTAs and autoplay
- [x] Product catalog with search, filter, pagination
- [x] Product detail with gallery, lightbox (zoom/pan/swipe)
- [x] Quote request form per product
- [x] Contact form with Google Maps
- [x] Testimonials page with search, filter, sort, likes
- [x] Testimonial detail with share buttons
- [x] About, Privacy, Terms static pages
- [x] 404 not found page
- [x] Header search
- [x] Light/dark theme toggle
- [x] Route page animations
- [x] Scroll reveal animations
- [x] Animated stats counters
- [x] Guided help assistant panel
- [x] WhatsApp chat with context-aware messages
- [x] Click-to-call phone link
- [x] Scroll-to-top button
- [x] SEO meta tags, Open Graph, Twitter cards
- [x] PWA service worker (production)

### Admin panel
- [x] JWT authentication with role-based access
- [x] Dashboard with stat cards and Chart.js charts
- [x] Product CRUD with multi-image gallery
- [x] Drag-and-drop image reorder (products)
- [x] Category CRUD with drag-and-drop reorder
- [x] Industry CRUD
- [x] Gallery CRUD
- [x] Testimonial CRUD
- [x] Hero slider CRUD with publish scheduling
- [x] Site settings (company, stats, about, social, maps, chat)
- [x] Contact messages inbox
- [x] Quote requests inbox
- [x] User management (admin only)
- [x] Audit logs with JSON diff (admin only)
- [x] Profile & password change
- [x] Cloudinary image upload
- [x] Admin dark mode
- [x] Mobile-responsive admin drawer

### Backend & infrastructure
- [x] REST API with Swagger documentation
- [x] PostgreSQL with migrations
- [x] JWT + refresh tokens
- [x] Cloudinary image CDN
- [x] Brevo HTML email notifications
- [x] Dynamic sitemap.xml and robots.txt
- [x] Audit logging for all admin mutations
- [x] API caching headers
- [x] Docker deployment support
- [x] CI/CD GitHub Actions
- [x] Postman API collection

---

*Last updated: July 2026 — Sri Vaari Traders*

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
For environment variables, see [ENVIRONMENT.md](ENVIRONMENT.md).
