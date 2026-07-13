import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { Category } from '../../../../models';

interface CategoryCard {
  image: string;
  title: string;
  description: string;
  badge: 'BEST SELLER' | 'NEW' | null;
  categorySlug?: string;
  searchQuery?: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=85',
    title: 'Industrial Motors',
    description: 'High efficiency electric motors engineered for continuous industrial performance.',
    badge: 'BEST SELLER',
    categorySlug: 'motors',
    searchQuery: 'motor'
  },
  {
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=85',
    title: 'Industrial Pumps',
    description: 'Energy efficient pumps designed for water supply, irrigation and industrial applications.',
    badge: 'BEST SELLER',
    categorySlug: 'pumps',
    searchQuery: 'pump'
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=85',
    title: 'GI Pipes',
    description: 'ISI certified galvanized iron pipes with superior corrosion resistance.',
    badge: null,
    categorySlug: 'pipes',
    searchQuery: 'gi pipe'
  },
  {
    image: 'https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=600&q=85',
    title: 'PVC Pipes',
    description: 'Heavy-duty PVC piping solutions for agriculture and industrial infrastructure.',
    badge: null,
    categorySlug: 'pipes',
    searchQuery: 'pvc pipe'
  },
  {
    image: 'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=600&q=85',
    title: 'Submersible Cables',
    description: 'Reliable flat cables built for long-lasting underwater pump installations.',
    badge: 'NEW',
    categorySlug: 'accessories',
    searchQuery: 'cable'
  },
  {
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=85',
    title: 'Water Meters',
    description: 'Accurate domestic and industrial water measurement systems.',
    badge: null,
    categorySlug: 'accessories',
    searchQuery: 'water meter'
  }
];

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

  readonly categoryCards = computed(() => {
    const slugToId = new Map(this.categories().map((category) => [category.slug, category.id]));

    return CATEGORY_CARDS.map((card) => ({
      ...card,
      categoryId: card.categorySlug ? slugToId.get(card.categorySlug) : undefined
    }));
  });

  queryParamsFor(card: { categoryId?: number; searchQuery?: string }) {
    if (card.categoryId != null) {
      return { categoryId: card.categoryId };
    }
    if (card.searchQuery) {
      return { search: card.searchQuery };
    }
    return {};
  }
}