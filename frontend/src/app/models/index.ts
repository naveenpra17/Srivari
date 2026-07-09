export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Product {
  id: number;
  categoryId?: number;
  categoryName?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  brochureUrl?: string;
  price?: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  specifications?: Record<string, string>;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AuditLogEntry {
  id: number;
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  sortOrder: number;
  active: boolean;
  publishAt?: string;
}

export interface Testimonial {
  id: number;
  slug?: string;
  clientName: string;
  designation?: string;
  company?: string;
  category?: string;
  content: string;
  fullStory?: string;
  imageUrl?: string;
  videoUrl?: string;
  rating: number;
  likes?: number;
  featured?: boolean;
  verified?: boolean;
  sortOrder: number;
  active: boolean;
  createdAt?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  sortOrder: number;
  active: boolean;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface HomePageData {
  heroSlides: HeroSlide[];
  featuredProducts: Product[];
  categories: Category[];
  industries: Industry[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  settings: SiteSettings;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  active: boolean;
  roles: string[];
  lastLoginAt?: string;
  createdAt?: string;
}

export interface QuoteRequest {
  id?: number;
  productId?: number;
  productName?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  quantity?: number;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalIndustries: number;
  totalTestimonials: number;
  totalGalleryItems: number;
  unreadMessages: number;
  totalUsers: number;
  siteStats: SiteSettings;
}

export interface Setting {
  id: number;
  settingKey: string;
  settingValue?: string;
  settingType: string;
  description?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export interface ImageUploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}
