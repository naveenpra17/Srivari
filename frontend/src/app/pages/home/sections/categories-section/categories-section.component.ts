import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { Category } from '../../../../models';

export interface CategoryCardView {
  id: number;
  title: string;
  description: string;
  image: string | null;
  categoryId: number;
}

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss'
})
export class CategoriesSectionComponent {
  categories = input<Category[]>([]);

  readonly categoryCards = computed<CategoryCardView[]>(() =>
    this.categories()
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        id: category.id,
        title: category.name,
        description: category.description?.trim() || `Explore our ${category.name.toLowerCase()} range`,
        image: category.imageUrl?.trim() || null,
        categoryId: category.id
      }))
  );
}
