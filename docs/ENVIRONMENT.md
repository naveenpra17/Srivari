# Environment Variables Reference

## Backend (.env for local / Render dashboard for production)

```env
# Profile
SPRING_PROFILES_ACTIVE=prod

# Database (Supabase)
DATABASE_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-supabase-password

# JWT
JWT_SECRET=your-256-bit-secret-key-minimum-32-characters-long
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000

# CORS
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:4200

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (optional - for contact notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@motors.com
MAIL_ADMIN=admin@motors.com
```

## Frontend

Update `src/environments/environment.prod.ts` or set `API_URL` on Vercel:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://srivari-1.onrender.com/api/v1',
  appName: 'Motors Industries',
  tagline: 'Where Innovation Meets Reliability'
};
```

## Supabase Connection

From Supabase Dashboard → Settings → Database:
- **Host:** `db.<ref>.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** (from project settings)

## Cloudinary Setup

1. Sign up at cloudinary.com
2. Dashboard shows Cloud Name, API Key, API Secret
3. Images upload to `motors/` folder automatically
4. Free tier: 25GB storage, 25GB bandwidth/month
