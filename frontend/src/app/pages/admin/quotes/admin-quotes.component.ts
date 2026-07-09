import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/ui.service';
import { QuoteRequest } from '../../../models';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-quotes.component.html',
  styleUrl: '../admin-shared.scss'
})
export class AdminQuotesComponent implements OnInit {
  private readonly admin = inject(AdminService);
  readonly auth = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);

  quotes = signal<QuoteRequest[]>([]);
  loading = signal(true);
  selected = signal<QuoteRequest | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.admin.getQuotes(this.currentPage(), 20).subscribe({
      next: (res) => {
        this.quotes.set(res.data.content);
        this.totalPages.set(res.data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  viewQuote(quote: QuoteRequest): void {
    this.selected.set(quote);
    if (!quote.isRead && quote.id) {
      this.admin.markQuoteRead(quote.id).subscribe({
        next: () => { quote.isRead = true; this.quotes.update(q => [...q]); }
      });
    }
  }

  closeDetail(): void { this.selected.set(null); }

  deleteQuote(quote: QuoteRequest): void {
    if (!quote.id || !confirm('Delete this quote request?')) return;
    this.admin.deleteQuote(quote.id).subscribe({
      next: () => { this.snackbar.success('Deleted'); this.closeDetail(); this.load(); },
      error: () => this.snackbar.error('Failed to delete')
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }
}
