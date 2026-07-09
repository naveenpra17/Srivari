import { Component, input, signal, OnInit, ElementRef, inject, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SiteSettings } from '../../../../models';



interface StatItem {

  key: string;

  value: string;

  label: string;

  icon: string;

}



@Component({

  selector: 'app-stats-section',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './stats-section.component.html',

  styleUrl: './stats-section.component.scss'

})

export class StatsSectionComponent implements OnInit {

  settings = input<SiteSettings>({});

  animated = signal(false);

  displayValues = signal<Record<string, string>>({});

  private readonly el = inject(ElementRef);

  private readonly platformId = inject(PLATFORM_ID);



  stats: StatItem[] = [

    { key: 'years_experience', value: '25', label: 'Years Experience', icon: 'calendar' },

    { key: 'happy_clients', value: '1500', label: 'Happy Clients', icon: 'users' },

    { key: 'products_delivered', value: '5000', label: 'Products Delivered', icon: 'package' },

    { key: 'countries_served', value: '50', label: 'Countries Served', icon: 'globe' },

    { key: 'support', value: '24/7', label: 'Support', icon: 'headset' }

  ];



  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {

      this.initStaticValues();

      return;

    }



    const observer = new IntersectionObserver(([entry]) => {

      if (entry.isIntersecting) {

        this.animated.set(true);

        this.startCounters();

        observer.disconnect();

      }

    }, { threshold: 0.25 });



    observer.observe(this.el.nativeElement);

  }



  getStatValue(stat: StatItem): string {

    if (stat.key === 'support') return '24/7';

    return this.settings()[stat.key] || stat.value;

  }



  getDisplayValue(stat: StatItem): string {

    return this.displayValues()[stat.key] ?? (stat.key === 'support' ? '24/7' : '0');

  }



  private initStaticValues(): void {

    const values: Record<string, string> = {};

    for (const stat of this.stats) {

      values[stat.key] = this.getStatValue(stat);

    }

    this.displayValues.set(values);

    this.animated.set(true);

  }



  private startCounters(): void {

    for (const stat of this.stats) {

      if (stat.key === 'support') {

        this.displayValues.update(v => ({ ...v, [stat.key]: '24/7' }));

        continue;

      }

      const raw = this.getStatValue(stat).replace(/[^\d]/g, '');

      const target = parseInt(raw, 10) || 0;

      this.animateValue(stat.key, target);

    }

  }



  private animateValue(key: string, target: number): void {

    const duration = 2000;

    const start = performance.now();



    const step = (now: number) => {

      const progress = Math.min((now - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.floor(eased * target);

      this.displayValues.update(v => ({ ...v, [key]: String(current) }));

      if (progress < 1) {

        requestAnimationFrame(step);

      }

    };



    requestAnimationFrame(step);

  }

}

