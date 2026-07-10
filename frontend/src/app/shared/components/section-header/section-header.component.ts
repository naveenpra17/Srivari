import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-header" appReveal>
      <div class="section-header-text">
        @if (eyebrow()) {
          <span class="eyebrow">{{ eyebrow() }}</span>
        }
        <h2 class="title">{{ title() }}</h2>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
      </div>
      @if (link()) {
        <a [routerLink]="link()!" class="view-all">
          {{ linkLabel() }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </a>
      }
    </div>
  `,
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>();
  eyebrow = input<string>();
  link = input<string>();
  linkLabel = input('View All');
}
