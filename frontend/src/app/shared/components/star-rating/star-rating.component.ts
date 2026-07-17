import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="star-rating" aria-hidden="true">
      @for (star of stars; track star) {
        <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="star <= rating() ? '#FF6B00' : '#E2E8F0'">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      }
    </span>
    <span class="visually-hidden">{{ rating() }} out of 5 stars</span>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      gap: 3px;
      align-items: center;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class StarRatingComponent {
  rating = input(5);
  readonly stars = [1, 2, 3, 4, 5];
}
