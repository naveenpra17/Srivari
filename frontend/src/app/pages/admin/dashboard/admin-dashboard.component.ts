import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../../../models';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="dashboard-intro">
      <div><span class="dashboard-kicker">Operations overview</span><h1>Dashboard</h1><p>Live catalogue and customer activity at a glance.</p></div>
      <div class="dashboard-status"><span></span> Live data</div>
    </header>
    
    <div class="row g-4 mb-4">
      @for (stat of statCards(); track stat.label) {
        <div class="col-lg-3 col-md-6">
          <div class="stat-card card-custom p-4" [style.--stat-index]="$index">
            <div class="stat-orb" aria-hidden="true"></div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      }
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card-custom p-4" style="height: 350px;">
          <h3 class="mb-3" style="color: var(--primary); font-size: 1.1rem;">Products by Category</h3>
          <canvas #categoryChart aria-label="Bar chart showing products per category"></canvas>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card-custom p-4" style="height: 350px;">
          <h3 class="mb-3" style="color: var(--primary); font-size: 1.1rem;">Status Distribution</h3>
          <canvas #statusChart aria-label="Doughnut chart showing active vs inactive products"></canvas>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card-custom p-4" style="height: 350px;">
          <h3 class="mb-3" style="color: var(--primary); font-size: 1.1rem;">Monthly Inquiries</h3>
          <canvas #inquiriesChart aria-label="Line chart showing monthly inquiry trends"></canvas>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card-custom p-4" style="height: 350px;">
          <h3 class="mb-3" style="color: var(--primary); font-size: 1.1rem;">Top Industries</h3>
          <canvas #industriesChart aria-label="Horizontal bar chart showing top industries"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-intro { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; margin-bottom:1.75rem; }
    .dashboard-intro h1 { margin:.2rem 0; color:var(--primary); font-size:clamp(1.65rem,3vw,2.15rem); }
    .dashboard-intro p { margin:0; color:var(--text-muted); }
    .dashboard-kicker { color:var(--secondary); font-size:.74rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
    .dashboard-status { display:flex; align-items:center; gap:.5rem; padding:.55rem .8rem; border:1px solid var(--border-color); border-radius:999px; color:var(--text-muted); font-size:.82rem; background:var(--card-bg); }
    .dashboard-status span { width:8px; height:8px; border-radius:50%; background:#31b46d; box-shadow:0 0 0 4px rgba(49,180,109,.13); }
    .stat-card {
      position:relative; overflow:hidden; isolation:isolate;
      &::after { position:absolute; inset:auto -32px -42px auto; z-index:-1; width:120px; aspect-ratio:1; border-radius:50%; background:linear-gradient(135deg, rgba(255,107,0,.18), rgba(10,43,94,.05)); content:''; }
      .stat-orb { position:absolute; top:14px; right:16px; width:9px; height:9px; border-radius:50%; background:var(--secondary); box-shadow:0 0 0 5px rgba(255,107,0,.12); }
      .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary); }
      .stat-label { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem; }
    }
    
    canvas {
      max-height: 280px !important;
    }
    @media (max-width: 576px) { .dashboard-intro { align-items:flex-start; flex-direction:column; } }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  statCards = signal<{ label: string; value: number }[]>([]);
  
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inquiriesChart') inquiriesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('industriesChart') industriesChartRef!: ElementRef<HTMLCanvasElement>;
  
  private charts: any[] = [];

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

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private loadChartData(): void {
    // Load products by category
    this.api.get<any[]>('/admin/products/by-category').subscribe({
      next: (res) => this.createCategoryChart(res.data || []),
      error: () => this.createCategoryChart([])
    });

    // Load product status distribution
    this.api.get<any>('/admin/products/status-distribution').subscribe({
      next: (res) => this.createStatusChart(res.data || { active: 0, inactive: 0 }),
      error: () => this.createStatusChart({ active: 0, inactive: 0 })
    });

    // Load monthly inquiries
    this.api.get<any[]>('/admin/inquiries/monthly').subscribe({
      next: (res) => this.createInquiriesChart(res.data || []),
      error: () => this.createInquiriesChart([])
    });

    // Load top industries
    this.api.get<any[]>('/admin/industries/top').subscribe({
      next: (res) => this.createIndustriesChart(res.data || []),
      error: () => this.createIndustriesChart([])
    });
  }

  private createCategoryChart(data: { category: string; count: number }[]): void {
    const ctx = this.categoryChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.category),
        datasets: [{
          label: 'Products',
          data: data.map(d => d.count),
          backgroundColor: 'rgba(10, 43, 94, 0.8)',
          borderColor: 'rgba(10, 43, 94, 1)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: this.getBarChartOptions('Number of Products')
    } as ChartConfiguration<'bar'>);
    this.charts.push(chart);
  }

  private createStatusChart(data: { active: number; inactive: number }): void {
    const ctx = this.statusChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [data.active, data.inactive],
          backgroundColor: ['rgba(40, 167, 69, 0.8)', 'rgba(220, 53, 69, 0.8)'],
          borderColor: ['rgba(40, 167, 69, 1)', 'rgba(220, 53, 69, 1)'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } }
        }
      }
    } as ChartConfiguration<'doughnut'>);
    this.charts.push(chart);
  }

  private createInquiriesChart(data: { month: string; count: number }[]): void {
    const ctx = this.inquiriesChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.month),
        datasets: [{
          label: 'Inquiries',
          data: data.map(d => d.count),
          fill: true,
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          borderColor: 'rgba(255, 107, 0, 1)',
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: 'rgba(255, 107, 0, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: this.getLineChartOptions('Monthly Inquiries')
    } as ChartConfiguration<'line'>);
    this.charts.push(chart);
  }

  private createIndustriesChart(data: { industry: string; count: number }[]): void {
    const ctx = this.industriesChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.industry),
        datasets: [{
          label: 'Products',
          data: data.map(d => d.count),
          backgroundColor: 'rgba(255, 107, 0, 0.8)',
          borderColor: 'rgba(255, 107, 0, 1)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        ...this.getBarChartOptions('Products'),
        indexAxis: 'y'
      }
    } as ChartConfiguration<'bar'>);
    this.charts.push(chart);
  }

  private getBarChartOptions(ylabel: string): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}` } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: ylabel } },
        x: { ticks: { maxRotation: 45, minRotation: 0 } }
      }
    };
  }

  private getLineChartOptions(ylabel: string): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}` } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: ylabel } },
        x: { ticks: { maxRotation: 45, minRotation: 0 } }
      },
      interaction: { intersect: false, mode: 'index' as const }
    };
  }
}
