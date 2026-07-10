import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SiteSettings } from '../../../../models';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface StatItem {
  key: string;
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-section.component.html',
  styleUrl: './stats-section.component.scss'
})
export class StatsSectionComponent implements OnInit {
  settings = input<SiteSettings>({});
  animated = signal(false);
  displayValues = signal<Record<string, string>>({});

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly stats: StatItem[] = [
    { key: 'years_experience', value: '25', label: 'Years Experience', icon: 'years' },
    { key: 'happy_clients', value: '1500', label: 'Happy Clients', icon: 'clients' },
    { key: 'products_delivered', value: '5000', label: 'Products Delivered', icon: 'products' },
    { key: 'countries_served', value: '50', label: 'Countries Served', icon: 'countries' },
    { key: 'support', value: '24/7', label: 'Support', icon: 'support' }
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.initStatic();
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

  getDisplay(stat: StatItem): string {
    return this.displayValues()[stat.key] ?? (stat.key === 'support' ? '24/7' : '0');
  }

  private initStatic(): void {
    const v: Record<string, string> = {};
    for (const s of this.stats) {
      v[s.key] = this.getRaw(s);
    }
    this.displayValues.set(v);
    this.animated.set(true);
  }

  private getRaw(stat: StatItem): string {
    if (stat.key === 'support') return '24/7';
    return this.settings()[stat.key] || stat.value;
  }

  private startCounters(): void {
    for (const stat of this.stats) {
      if (stat.key === 'support') {
        this.displayValues.update(v => ({ ...v, [stat.key]: '24/7' }));
        continue;
      }
      const target = parseInt(this.getRaw(stat).replace(/\D/g, ''), 10) || 0;
      this.animateValue(stat.key, target);
    }
  }

  private animateValue(key: string, target: number): void {
    const start = performance.now();
    const duration = 2000;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      this.displayValues.update(v => ({ ...v, [key]: String(Math.floor(eased * target)) }));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
