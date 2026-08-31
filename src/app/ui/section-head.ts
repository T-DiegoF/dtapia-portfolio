import { Component, input } from '@angular/core';

import { Reveal } from '../core/reveal';

/** The printed-catalogue heading used by every section: mono index, then title. */
@Component({
  selector: 'dt-section-head',
  imports: [Reveal],
  template: `
    <div class="section-head">
      <p class="eyebrow index" [dtReveal]="0">
        <span class="n">{{ index() }}</span>
        {{ label() }}
      </p>

      <div class="titling">
        <h2 class="title" [dtReveal]="80">{{ title() }}</h2>
        @if (lead(); as text) {
          <p class="prose lead" [dtReveal]="160">{{ text }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .index {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      padding-top: 0.6rem;
    }

    .n {
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }

    .titling {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 0;
    }

    .title {
      font-size: clamp(2rem, 5.5vw, 3.5rem);
      letter-spacing: -0.045em;
    }

    .lead {
      font-size: 0.875rem;
      max-width: 52ch;
    }
  `,
})
export class SectionHead {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string | null>(null);
}
