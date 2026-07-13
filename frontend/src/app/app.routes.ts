import { Routes } from '@angular/router';
import { authGuard, adminOnlyGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Sri Vaari Traders - Where Innovation Meets Reliability'
      },
      {
        path: 'testimonials/:slug',
        loadComponent: () => import('./pages/testimonials/testimonial-detail.component').then(m => m.TestimonialDetailComponent),
        title: 'Customer Story - Sri Vaari Traders'
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./pages/testimonials/testimonials-page.component').then(m => m.TestimonialsPageComponent),
        title: 'Testimonials - Sri Vaari Traders'
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/static/about-page.component').then(m => m.AboutPageComponent),
        title: 'About Us - Sri Vaari Traders'
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/static/privacy-page.component').then(m => m.PrivacyPageComponent),
        title: 'Privacy Policy - Sri Vaari Traders'
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/static/terms-page.component').then(m => m.TermsPageComponent),
        title: 'Terms of Service - Sri Vaari Traders'
      },
      {
        path: 'products/:slug',
        loadComponent: () => import('./pages/products/product-detail.component').then(m => m.ProductDetailComponent),
        title: 'Product Details - Sri Vaari Traders'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products-page.component').then(m => m.ProductsPageComponent),
        title: 'Products - Sri Vaari Traders'
      }
    ]
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login - Sri Vaari Traders'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Dashboard - Sri Vaari Traders Admin'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/products/admin-products.component').then(m => m.AdminProductsComponent),
        title: 'Products - Sri Vaari Traders Admin'
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
        title: 'Categories - Sri Vaari Traders Admin'
      },
      {
        path: 'industries',
        loadComponent: () => import('./pages/admin/industries/admin-industries.component').then(m => m.AdminIndustriesComponent),
        title: 'Industries - Sri Vaari Traders Admin'
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/admin/gallery/admin-gallery.component').then(m => m.AdminGalleryComponent),
        title: 'Gallery - Sri Vaari Traders Admin'
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./pages/admin/testimonials/admin-testimonials.component').then(m => m.AdminTestimonialsComponent),
        title: 'Testimonials - Sri Vaari Traders Admin'
      },
      {
        path: 'hero-slider',
        loadComponent: () => import('./pages/admin/hero-slider/admin-hero-slider.component').then(m => m.AdminHeroSliderComponent),
        title: 'Hero Slider - Sri Vaari Traders Admin'
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/admin/messages/admin-messages.component').then(m => m.AdminMessagesComponent),
        title: 'Messages - Sri Vaari Traders Admin'
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent),
        title: 'Settings - Sri Vaari Traders Admin'
      },
      {
        path: 'quotes',
        loadComponent: () => import('./pages/admin/quotes/admin-quotes.component').then(m => m.AdminQuotesComponent),
        title: 'Quotes - Sri Vaari Traders Admin'
      },
      {
        path: 'users',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'Users - Sri Vaari Traders Admin'
      },
      {
        path: 'audit-logs',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./pages/admin/audit-log/admin-audit-log.component').then(m => m.AdminAuditLogComponent),
        title: 'Audit Logs - Sri Vaari Traders Admin'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent),
        title: 'Profile - Sri Vaari Traders Admin'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Not Found'
  }
];
