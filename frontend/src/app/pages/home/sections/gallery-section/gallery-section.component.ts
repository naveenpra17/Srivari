import { Component, input, signal, HostListener } from '@angular/core';

import { CommonModule } from '@angular/common';

import { GalleryItem } from '../../../../models';



@Component({

  selector: 'app-gallery-section',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './gallery-section.component.html',

  styleUrl: './gallery-section.component.scss'

})

export class GallerySectionComponent {

  items = input<GalleryItem[]>([]);

  selected = signal<GalleryItem | null>(null);



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

    if (this.selected()) {

      this.closeLightbox();

    }

  }

}

