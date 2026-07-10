import { ChangeDetectionStrategy, Component, computed, input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryItem } from '../../../../models';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss'
})
export class GallerySectionComponent {
  items = input<GalleryItem[]>([]);
  selected = signal<GalleryItem | null>(null);

  readonly fallbacks: GalleryItem[] = [
    { id: 1, title: 'Manufacturing Floor', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', sortOrder: 1, active: true },
    { id: 2, title: 'Motor Assembly', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', sortOrder: 2, active: true },
    { id: 3, title: 'Quality Testing', imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80', sortOrder: 3, active: true },
    { id: 4, title: 'Industrial Pumps', imageUrl: 'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=600&q=80', sortOrder: 4, active: true },
    { id: 5, title: 'Warehouse', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', sortOrder: 5, active: true },
    { id: 6, title: 'Engineering Team', imageUrl: 'https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=600&q=80', sortOrder: 6, active: true }
  ];

  readonly displayItems = computed(() => {
    const api = this.items();
    return api.length > 0 ? api : this.fallbacks;
  });

  openLightbox(item: GalleryItem): void {
    this.selected.set(item);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.selected.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selected()) this.closeLightbox();
  }
}
