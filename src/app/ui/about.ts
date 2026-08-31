import { Component, inject } from '@angular/core';

import { I18n } from '../core/i18n';
import { PROFILE } from '../core/profile';
import { Reveal } from '../core/reveal';
import { SectionHead } from './section-head';

@Component({
  selector: 'dt-about',
  imports: [SectionHead, Reveal],
  template: `
    <section class="about" id="about">
      <div class="shell">
        <dt-section-head index="02" [label]="t().aboutIndex" [title]="t().aboutTitle" />

        <div class="body">
          <div class="copy">
            <p class="prose big" [dtReveal]="0">{{ t().aboutBody }}</p>
            <p class="prose" [dtReveal]="90">{{ t().aboutBody2 }}</p>
          </div>

          <dl class="facts" [dtReveal]="150">
            <div class="fact">
              <dt class="eyebrow">Base</dt>
              <dd>{{ t().place }}, Argentina</dd>
            </div>
            <div class="fact">
              <dt class="eyebrow">Now</dt>
              <dd>{{ profile.company }}</dd>
            </div>
            <div class="fact">
              <dt class="eyebrow">Focus</dt>
              <dd>Angular &middot; NestJS &middot; AWS</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about {
      padding-block: var(--rhythm);
      border-top: 1px solid var(--rule);
    }

    .body {
      display: grid;
      gap: clamp(2rem, 5vw, 4rem);
    }

    @media (min-width: 900px) {
      .body {
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
        align-items: start;
      }
    }

    .copy {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .big {
      font-size: clamp(0.9375rem, 1.6vw, 1.125rem);
      color: var(--ink);
    }

    .facts {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-top: 0.4rem;
    }

    @media (min-width: 900px) {
      .facts {
        border-left: 1px solid var(--rule);
        padding-left: clamp(1.5rem, 3vw, 2.5rem);
      }
    }

    .fact {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .fact dd {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--ink-2);
    }
  `,
})
export class About {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly profile = PROFILE;
}
