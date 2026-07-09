# Deployment Guide — Motors Industries

Deploy the full stack using free-tier services. Images are stored in **Cloudinary** (admin uploads go to `motors/{folder}` automatically).

| Service | Platform | Purpose |
|---------|----------|---------|
| Database | [Supabase](https://supabase.com) | PostgreSQL |
| Backend API | [Render](https://render.com) | Spring Boot |
| Frontend | [Vercel](https://vercel.com) | Angular SPA |
| Images | [Cloudinary](https://cloudinary.com) | CDN + uploads |

---

## Prerequisites

1. [GitHub](https://github.com) account
2. Code pushed to a GitHub repository
3. Cloudinary account (free tier)

---

## Step 1 — Push code to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit — Motors Industries full stack"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/motors.git
git push -u origin main
```

> **Note:** Never commit `.env` files. Use `.env.example` as a reference only.

---

## Step 2 — Supabase (Database)

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run these files **in order**:
   - `database/schema.sql`
   - `database/seed.sql`
3. Go to **Project Settings → Database** and copy:
   - Host (e.g. `db.xxxxx.supabase.co`)
   - Database name (`postgres`)
   - Port (`5432`)
   - User (`postgres`)
   - Password

**JDBC URL for Render:**

```
jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
```

**Default admin after seed:**

| Field | Value |
|-------|-------|
| Email | `admin@motors.com` |
| Password | `Admin@123` |

> Change this password immediately after first login.

---

## Step 3 — Cloudinary (Images)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Open **Dashboard** and copy:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. These are set as Render environment variables (Step 4)

**How images work:**

- Admin panel → upload any image → stored at `motors/{folder}` on Cloudinary
- Folders: `hero`, `products`, `gallery`, `testimonials`, etc.
- Seed data uses external URLs; replace via admin uploads after deploy

**Optional — upload seed images to your Cloudinary:**

1. Upload hero/product images in Cloudinary Media Library
2. Copy secure URLs
3. Update records in admin or run SQL `UPDATE` statements

---

## Step 4 — Render (Backend — Docker)

Render uses **Docker** for Java/Spring Boot (no native Java runtime). A `Dockerfile` is included in `backend/`.

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` *(auto-detected if root is `backend`)* |
| **Health Check Path** | `/api/v1/public/health` |

> **Blueprint:** You can also use **New → Blueprint** and point to `backend/render.yaml`.

**Or via Render dashboard manually:**
- Environment → **Docker**
- Root directory → `backend`
- Render builds the image from `backend/Dockerfile` and runs the Spring Boot JAR inside the container.

**Local Docker test (optional):**

```bash
cd backend
docker build -t motors-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/motors_db \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=yourpassword \
  -e JWT_SECRET=your-secret-key-at-least-256-bits-long \
  -e CORS_ALLOWED_ORIGINS=http://localhost:4200 \
  motors-backend
```

### Environment variables (Render → Environment)

Copy from `backend/.env.example` and fill in real values:

| Variable | Example |
|----------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://db.xxx.supabase.co:5432/postgres?sslmode=require` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | *(Supabase password)* |
| `JWT_SECRET` | *(run `openssl rand -base64 48`)* |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `SITE_FRONTEND_URL` | `https://your-app.vercel.app` |
| `SITE_API_URL` | `https://motors-backend.onrender.com/api` |
| `CLOUDINARY_CLOUD_NAME` | *(from Cloudinary)* |
| `CLOUDINARY_API_KEY` | *(from Cloudinary)* |
| `CLOUDINARY_API_SECRET` | *(from Cloudinary)* |

> **Docker build failed with `DependencyResolutionException`?** Ensure `pom.xml` uses `cloudinary-http44` version `1.39.0` (version `2.0.0` does not exist on Maven Central).
| `MAIL_HOST` | `smtp.gmail.com` *(optional)* |
| `MAIL_PORT` | `587` |
| `MAIL_USERNAME` | your email |
| `MAIL_PASSWORD` | app password |
| `MAIL_FROM` | `noreply@motors.com` |
| `MAIL_ADMIN` | `admin@motors.com` |

> **Mail is optional.** If `MAIL_HOST` is not set, the app starts normally and contact/quote forms still save to the database — email notifications are skipped.

5. Deploy and wait for **Live** status
6. Test: `https://YOUR-SERVICE.onrender.com/api/v1/public/health` → `{"status":"UP"}`
7. Swagger: `https://YOUR-SERVICE.onrender.com/api/swagger-ui.html`

> Render free tier sleeps after inactivity. First request may take 30–60 seconds.

---

## Step 5 — Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Angular |
| Build Command | `npm run build` |
| Output Directory | `dist/frontend/browser` |

4. Add **Environment Variables** (Production):

| Variable | Value |
|----------|-------|
| `API_URL` | `https://YOUR-SERVICE.onrender.com/api/v1` |

5. Deploy

The build script runs `scripts/set-env.mjs` which writes `environment.prod.ts` from `API_URL`.

---

## Step 6 — Connect frontend & backend

After Vercel deploys, copy your Vercel URL (e.g. `https://motors.vercel.app`).

**Update Render environment variables:**

```
CORS_ALLOWED_ORIGINS=https://motors.vercel.app
SITE_FRONTEND_URL=https://motors.vercel.app
```

Redeploy Render (or use **Manual Deploy**) so CORS picks up the new origin.

---

## Step 7 — Post-deployment checklist

- [ ] Health check: `GET /api/v1/public/health` returns `UP`
- [ ] Homepage loads with hero carousel
- [ ] Admin login: `https://your-app.vercel.app/admin/login`
- [ ] Upload a test image in Admin → Hero Slider (confirms Cloudinary)
- [ ] Submit contact form
- [ ] Change default admin password
- [ ] Update WhatsApp phone in Admin → Settings
- [ ] Replace seed images with Cloudinary URLs via admin

---

## Upgrading an existing database

If you deployed before newer features, run migrations in order:

```
database/migrations/001_quote_requests.sql
database/migrations/002_chat_whatsapp_settings.sql
database/migrations/003_testimonials_enhance.sql
database/migrations/004_hero_publish_at.sql
```

Fresh installs only need `schema.sql` + `seed.sql`.

---

## Custom domains (optional)

### Vercel
**Settings → Domains** → add your domain → update `API_URL` if needed

### Render
**Settings → Custom Domains** → add API subdomain → update:
- `CORS_ALLOWED_ORIGINS`
- `SITE_FRONTEND_URL` / `SITE_API_URL`
- Vercel `API_URL`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Set `CORS_ALLOWED_ORIGINS` to exact Vercel URL (no trailing slash) |
| DB connection failed | Verify JDBC URL includes `?sslmode=require` |
| Image upload fails | Check all 3 Cloudinary env vars on Render |
| 502 on first API call | Render free tier waking up — wait and retry |
| Admin login fails | Re-run `seed.sql` or reset password in DB |
| Blank homepage | Check browser console; verify `API_URL` on Vercel |
| `jpaAuditingHandler` bean error | Fixed in code — remove duplicate `@EnableJpaAuditing`; redeploy |
| Profile shows `dev` on Render | Set `SPRING_PROFILES_ACTIVE=prod` in Render env vars (also set in Dockerfile) |
| `JavaMailSender` bean not found | Mail is optional — redeploy latest code; or set `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` |

---

## Local development with Cloudinary

Create `backend/.env` or set environment variables locally:

```bash
export CLOUDINARY_CLOUD_NAME=your_cloud
export CLOUDINARY_API_KEY=your_key
export CLOUDINARY_API_SECRET=your_secret
```

Then run the backend as usual. Without Cloudinary vars, admin image upload will return an error.
