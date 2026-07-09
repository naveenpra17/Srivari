import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import {
  AdminUser, AuditLogEntry, Category, ContactMessage, GalleryItem, HeroSlide, ImageUploadResponse,
  Industry, PageResponse, Product, ProductImage, QuoteRequest, Setting, Testimonial
} from '../../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  // Products
  getProducts(page = 0, size = 20) {
    return this.api.get<PageResponse<Product>>('/products/all', { page, size });
  }
  createProduct(data: Partial<Product>) {
    return this.api.post<Product>('/products', data);
  }
  updateProduct(id: number, data: Partial<Product>) {
    return this.api.put<Product>(`/products/${id}`, data);
  }
  deleteProduct(id: number) {
    return this.api.delete<void>(`/products/${id}`);
  }

  // Product Images
  getProductImages(productId: number) {
    return this.api.get<ProductImage[]>(`/products/${productId}/images`);
  }
  addProductImage(productId: number, data: Partial<ProductImage>) {
    return this.api.post<ProductImage>(`/products/${productId}/images`, data);
  }
  updateProductImage(productId: number, imageId: number, data: Partial<ProductImage>) {
    return this.api.put<ProductImage>(`/products/${productId}/images/${imageId}`, data);
  }
  setPrimaryProductImage(productId: number, imageId: number) {
    return this.api.patch<ProductImage>(`/products/${productId}/images/${imageId}/primary`);
  }
  deleteProductImage(productId: number, imageId: number) {
    return this.api.delete<void>(`/products/${productId}/images/${imageId}`);
  }

  // Categories
  getCategories() {
    return this.api.get<Category[]>('/categories/all');
  }
  createCategory(data: Partial<Category>) {
    return this.api.post<Category>('/categories', data);
  }
  updateCategory(id: number, data: Partial<Category>) {
    return this.api.put<Category>(`/categories/${id}`, data);
  }
  deleteCategory(id: number) {
    return this.api.delete<void>(`/categories/${id}`);
  }

  // Industries
  getIndustries() {
    return this.api.get<Industry[]>('/industries/all');
  }
  createIndustry(data: Partial<Industry>) {
    return this.api.post<Industry>('/industries', data);
  }
  updateIndustry(id: number, data: Partial<Industry>) {
    return this.api.put<Industry>(`/industries/${id}`, data);
  }
  deleteIndustry(id: number) {
    return this.api.delete<void>(`/industries/${id}`);
  }

  // Hero Slider
  getHeroSlides() {
    return this.api.get<HeroSlide[]>('/hero-slider/all');
  }
  createHeroSlide(data: Partial<HeroSlide>) {
    return this.api.post<HeroSlide>('/hero-slider', data);
  }
  updateHeroSlide(id: number, data: Partial<HeroSlide>) {
    return this.api.put<HeroSlide>(`/hero-slider/${id}`, data);
  }
  deleteHeroSlide(id: number) {
    return this.api.delete<void>(`/hero-slider/${id}`);
  }

  // Gallery
  getGallery() {
    return this.api.get<GalleryItem[]>('/gallery/all');
  }
  createGalleryItem(data: Partial<GalleryItem>) {
    return this.api.post<GalleryItem>('/gallery', data);
  }
  updateGalleryItem(id: number, data: Partial<GalleryItem>) {
    return this.api.put<GalleryItem>(`/gallery/${id}`, data);
  }
  deleteGalleryItem(id: number) {
    return this.api.delete<void>(`/gallery/${id}`);
  }

  // Testimonials
  getTestimonials() {
    return this.api.get<Testimonial[]>('/testimonials/all');
  }
  createTestimonial(data: Partial<Testimonial>) {
    return this.api.post<Testimonial>('/testimonials', data);
  }
  updateTestimonial(id: number, data: Partial<Testimonial>) {
    return this.api.put<Testimonial>(`/testimonials/${id}`, data);
  }
  deleteTestimonial(id: number) {
    return this.api.delete<void>(`/testimonials/${id}`);
  }

  // Settings
  getSettings() {
    return this.api.get<Setting[]>('/settings');
  }
  updateSettings(settings: Record<string, string>) {
    return this.api.put<void>('/settings', settings);
  }

  // Messages
  getMessages(page = 0, size = 20) {
    return this.api.get<PageResponse<ContactMessage>>('/admin/messages', { page, size });
  }
  markMessageRead(id: number) {
    return this.api.patch<ContactMessage>(`/admin/messages/${id}/read`);
  }
  deleteMessage(id: number) {
    return this.api.delete<void>(`/admin/messages/${id}`);
  }

  // Quotes
  getQuotes(page = 0, size = 20) {
    return this.api.get<PageResponse<QuoteRequest>>('/admin/quotes', { page, size });
  }
  markQuoteRead(id: number) {
    return this.api.patch<QuoteRequest>(`/admin/quotes/${id}/read`);
  }
  deleteQuote(id: number) {
    return this.api.delete<void>(`/admin/quotes/${id}`);
  }

  // Users
  getUsers() {
    return this.api.get<AdminUser[]>('/users');
  }
  getRoles() {
    return this.api.get<string[]>('/users/roles');
  }
  createUser(data: Partial<AdminUser> & { password?: string; roles?: string[] }) {
    return this.api.post<AdminUser>('/users', data);
  }
  updateUser(id: number, data: Partial<AdminUser> & { password?: string; roles?: string[] }) {
    return this.api.put<AdminUser>(`/users/${id}`, data);
  }
  deleteUser(id: number) {
    return this.api.delete<void>(`/users/${id}`);
  }

  // Audit Logs
  getAuditLogs(page = 0, size = 25) {
    return this.api.get<PageResponse<AuditLogEntry>>('/admin/audit-logs', { page, size });
  }

  // Upload
  uploadImage(file: File, folder: string) {
    return this.api.upload<ImageUploadResponse>('/admin/upload', file, folder);
  }
}
