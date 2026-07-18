import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuditLogEntry } from '../../../models';

@Component({
  selector: 'app-admin-audit-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-audit-log.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminAuditLogComponent implements OnInit {
  private readonly admin = inject(AdminService);

  logs = signal<AuditLogEntry[]>([]);
  loading = signal(true);
  selectedLog = signal<AuditLogEntry | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getAuditLogs(this.currentPage(), 25).subscribe({
      next: (res) => {
        this.logs.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  viewLog(entry: AuditLogEntry): void {
    this.selectedLog.set(entry);
  }

  closeDetail(): void {
    this.selectedLog.set(null);
  }

  actionClass(action: string): string {
    switch (action) {
      case 'CREATE': return 'badge active';
      case 'UPDATE': return 'badge unread';
      case 'DELETE': return 'badge inactive';
      default: return 'badge';
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }
}
