import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss'
})
export class ProductsSectionComponent {
  products = input<Product[]>([]);
}
