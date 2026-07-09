import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Testimonial } from '../../../models';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StarRatingComponent],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss'
})
export class TestimonialCardComponent {
  testimonial = input.required<Testimonial>();
  showLike = input(true);
  compact = input(false);
  liked = output<Testimonial>();

  onLike(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.liked.emit(this.testimonial());
  }
}
