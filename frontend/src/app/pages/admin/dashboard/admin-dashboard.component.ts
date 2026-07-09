import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="mb-4" style="color: var(--primary); font-size: 1.75rem">Dashboard</h1>
    <div class="row g-4">
      @for (stat of statCards(); track stat.label) {
        <div class="col-lg-3 col-md-6">
          <div class="stat-card card-custom p-4">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary); }
      .stat-label { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  statCards = signal<{ label: string; value: number }[]>([]);

  ngOnInit(): void {
    this.api.get<DashboardStats>('/admin/dashboard').subscribe({
      next: (res) => {
        const d = res.data;
        this.statCards.set([
          { label: 'Products', value: d.totalProducts },
          { label: 'Categories', value: d.totalCategories },
          { label: 'Industries', value: d.totalIndustries },
          { label: 'Testimonials', value: d.totalTestimonials },
          { label: 'Gallery Items', value: d.totalGalleryItems },
          { label: 'Unread Messages', value: d.unreadMessages },
          { label: 'Users', value: d.totalUsers }
        ]);
      }
    });
  }
}
