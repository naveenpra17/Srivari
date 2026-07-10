import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../../../models';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent {
  settings = input<SiteSettings>({});

  readonly defaults = {
    mission: 'To deliver world-class industrial motors, pumps and piping solutions that power global manufacturing with reliability and innovation.',
    vision: 'To be the most trusted industrial engineering partner, setting benchmarks in quality, sustainability and customer success.',
    history: 'Founded over two decades ago, Motors Industries has grown from a regional manufacturer to a global supplier serving critical sectors worldwide.'
  };
}
