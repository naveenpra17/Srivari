import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [attr.aria-label]="rating() + ' out of 5 stars'">
      @for (star of stars; track star) {
        <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="star <= rating() ? '#FF6B00' : '#E2E8F0'" aria-hidden="true">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      gap: 3px;
      align-items: center;
    }
  `]
})
export class StarRatingComponent {
  rating = input(5);
  readonly stars = [1, 2, 3, 4, 5];
}
