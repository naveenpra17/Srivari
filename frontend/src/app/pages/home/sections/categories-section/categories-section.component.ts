import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { Category } from '../../../../models';

const FALLBACK_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=85';

/** Used only when category.imageUrl is null in the API. */
const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  motors: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=85',
  pumps: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=85',
  pipes: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=85',
  accessories: 'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=600&q=85'
};

export interface CategoryCardView {
  id: number;
  title: string;
  description: string;
  image: string;
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
        image: category.imageUrl?.trim()
          || CATEGORY_IMAGE_BY_SLUG[category.slug]
          || FALLBACK_CATEGORY_IMAGE,
        categoryId: category.id
      }))
  );
}
