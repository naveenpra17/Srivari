import { Component, input, output, signal, effect } from '@angular/core';
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

  animatingLike = signal(false);
  animatingLikeClass = signal('');

  onLike(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Trigger animation
    this.animatingLike.set(true);
    this.animatingLikeClass.set('animating-like');
    
    // Emit like event
    this.liked.emit(this.testimonial());
    
    // Reset animation after it completes
    setTimeout(() => {
      this.animatingLike.set(false);
      this.animatingLikeClass.set('');
    }, 500);
  }
}
