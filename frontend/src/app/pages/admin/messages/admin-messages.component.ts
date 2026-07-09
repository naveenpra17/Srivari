import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { ContactMessage } from '../../../models';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-messages.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminMessagesComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly snackbar = inject(SnackbarService);

  messages = signal<ContactMessage[]>([]);
  loading = signal(true);
  selectedMessage = signal<ContactMessage | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getMessages(this.currentPage(), 20).subscribe({
      next: (res) => {
        this.messages.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  viewMessage(msg: ContactMessage): void {
    this.selectedMessage.set(msg);
    if (!msg.isRead) {
      this.admin.markMessageRead(msg.id).subscribe({
        next: () => {
          msg.isRead = true;
          this.messages.update(list => [...list]);
        }
      });
    }
  }

  closeDetail(): void { this.selectedMessage.set(null); }

  deleteMessage(msg: ContactMessage): void {
    if (!confirm(`Delete message from "${msg.name}"?`)) return;
    this.admin.deleteMessage(msg.id).subscribe({
      next: () => {
        this.snackbar.success('Message deleted');
        this.closeDetail();
        this.load();
      },
      error: () => this.snackbar.error('Failed to delete')
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }
}
