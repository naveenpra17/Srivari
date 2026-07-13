import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TestimonialService } from '../../core/services/testimonial.service';
import { SeoService } from '../../core/services/seo.service';
import { ChatWidgetService } from '../../core/chat/chat-widget.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { TestimonialCardComponent } from '../../shared/components/testimonial-card/testimonial-card.component';
import { Testimonial } from '../../models';

@Component({
  selector: 'app-testimonial-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StarRatingComponent, TestimonialCardComponent],
  templateUrl: './testimonial-detail.component.html',
  styleUrl: './testimonial-detail.component.scss'
})
export class TestimonialDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly testimonialService = inject(TestimonialService);
  private readonly seo = inject(SeoService);
  private readonly chat = inject(ChatWidgetService);

  testimonial = signal<Testimonial | null>(null);
  related = signal<Testimonial[]>([]);
  loading = signal(true);
  liked = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.testimonialService.getBySlug(slug).subscribe({
        next: (res) => {
          this.testimonial.set(res.data);
          this.loading.set(false);
          this.updateSeo(res.data);
          this.chat.setPageContext({ type: 'product', productName: res.data.clientName });
          this.loadRelated(slug);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  loadRelated(slug: string): void {
    this.testimonialService.getRelated(slug).subscribe({
      next: (res) => this.related.set(res.data)
    });
  }

  likeStory(): void {
    const t = this.testimonial();
    if (!t || this.liked()) return;
    this.testimonialService.like(t.id).subscribe({
      next: (res) => {
        this.testimonial.set(res.data);
        this.liked.set(true);
      }
    });
  }

  share(platform: 'twitter' | 'linkedin' | 'copy'): void {
    const t = this.testimonial();
    if (!t) return;
    const url = window.location.href;
    const text = `Read how ${t.clientName} from ${t.company || 'Sri Vaari Traders'} shared their experience`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard?.writeText(url);
    }
  }

  private updateSeo(t: Testimonial): void {
    this.seo.update({
      title: `${t.clientName} — Customer Story`,
      description: t.content,
      image: t.imageUrl,
      type: 'article'
    });
  }
}
