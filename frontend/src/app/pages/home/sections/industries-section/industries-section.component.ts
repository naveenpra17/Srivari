import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Industry } from '../../../../models';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface IndustryCard {
  id: number;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-industries-section',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './industries-section.component.html',
  styleUrl: './industries-section.component.scss'
})
export class IndustriesSectionComponent {
  industries = input<Industry[]>([]);

  readonly fallbacks: IndustryCard[] = [
    { id: 1, name: 'Oil & Gas', icon: 'oil', description: 'High-pressure motors and pumps for upstream and downstream operations.' },
    { id: 2, name: 'Water', icon: 'water', description: 'Efficient pumping solutions for municipal and industrial water systems.' },
    { id: 3, name: 'Power', icon: 'power', description: 'Reliable drive systems for power generation and distribution.' },
    { id: 4, name: 'Chemical', icon: 'chemical', description: 'Corrosion-resistant equipment for chemical processing plants.' },
    { id: 5, name: 'Mining', icon: 'mining', description: 'Heavy-duty motors built for extreme mining environments.' },
    { id: 6, name: 'Marine', icon: 'marine', description: 'Marine-grade pumps and motors for offshore applications.' },
    { id: 7, name: 'Food', icon: 'food', description: 'Hygienic pumps and motors for food and beverage production.' },
    { id: 8, name: 'Textile', icon: 'textile', description: 'Precision motors for spinning, weaving and processing lines.' }
  ];

  readonly displayItems = computed(() => {
    const api = this.industries();
    if (api.length > 0) {
      return api.map(i => ({
        id: i.id,
        name: i.name,
        icon: i.icon || 'default',
        description: i.description || ''
      }));
    }
    return this.fallbacks;
  });
}
