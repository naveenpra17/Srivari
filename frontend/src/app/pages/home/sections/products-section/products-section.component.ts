import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss'
})
export class ProductsSectionComponent {
  products = input<Product[]>([]);

  readonly fallbacks = [
    { name: 'Industrial Motors', slug: 'industrial-ac-motor', desc: 'High-efficiency AC & DC motors for heavy-duty applications.', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80', cat: 'Motors' },
    { name: 'Centrifugal Pumps', slug: 'centrifugal-pump', desc: 'Robust pumps for fluid transfer in industrial systems.', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80', cat: 'Pumps' },
    { name: 'Stainless Steel Pipes', slug: 'stainless-steel-pipes', desc: 'Corrosion-resistant piping for harsh environments.', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80', cat: 'Pipes' },
    { name: 'Motor Accessories', slug: 'motor-couplings', desc: 'Couplings, bearings and components for power transmission.', img: 'https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=500&q=80', cat: 'Accessories' }
  ];
}
