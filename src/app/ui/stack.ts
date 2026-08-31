import { Component, inject } from '@angular/core';

import { I18n, type Dictionary } from '../core/i18n';
import { STACK_GROUPS } from '../core/profile';
import { Reveal } from '../core/reveal';
import { SectionHead } from './section-head';

@Component({
  selector: 'dt-stack',
  imports: [SectionHead, Reveal],
  template: `
    <section class="stack" id="stack">
      <div class="shell">
        <dt-section-head index="03" [label]="t().stackIndex" [title]="t().stackTitle" [lead]="t().stackLead" />

        <div class="groups">
          @for (group of groups; track group.key; let i = $index) {
            <section class="group" [dtReveal]="i * 80">
              <h3 class="eyebrow">{{ label(group.key) }}</h3>
              <ul class="items">
                @for (item of group.items; track item) {
                  <li class="item">{{ item }}</li>
                }
              </ul>
            </section>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .stack {
      padding-block: var(--rhythm);
      border-top: 1px solid var(--rule);
    }

    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr));
      gap: clamp(2rem, 4vw, 3rem);
      border-top: 1px solid var(--rule);
      padding-top: clamp(1.75rem, 3.5vw, 2.5rem);
    }

    .group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item {
      position: relative;
      padding-left: 0.9rem;
      font-size: 0.8125rem;
      color: var(--ink-2);
      transition: color 0.25s var(--ease), transform 0.25s var(--ease-out);
    }

    /* A tick in the margin, letterpress-style, that inks in on hover. */
    .item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.7em;
      width: 5px;
      height: 1px;
      background: var(--ink-3);
      transition: width 0.25s var(--ease-out), background-color 0.25s var(--ease);
    }

    .item:hover {
      color: var(--ink);
      transform: translateX(2px);
    }

    .item:hover::before {
      width: 9px;
      background: var(--accent);
    }
  `,
})
export class Stack {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly groups = STACK_GROUPS;

  protected label(key: (typeof STACK_GROUPS)[number]['key']): string {
    return this.t()[key satisfies keyof Dictionary];
  }
}
