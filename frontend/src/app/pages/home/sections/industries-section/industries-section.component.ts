import { Component, input, signal, OnInit, ElementRef, inject, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Industry } from '../../../../models';



@Component({

  selector: 'app-industries-section',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './industries-section.component.html',

  styleUrl: './industries-section.component.scss'

})

export class IndustriesSectionComponent implements OnInit {

  industries = input<Industry[]>([]);

  visible = signal(false);

  private readonly el = inject(ElementRef);

  private readonly platformId = inject(PLATFORM_ID);



  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {

      this.visible.set(true);

      return;

    }



    const observer = new IntersectionObserver(([entry]) => {

      if (entry.isIntersecting) {

        this.visible.set(true);

        observer.disconnect();

      }

    }, { threshold: 0.15 });



    observer.observe(this.el.nativeElement);

  }

}

