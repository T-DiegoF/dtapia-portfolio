import { Component, inject } from '@angular/core';

import { I18n, type Dictionary } from '../core/i18n';
import { STACK_GROUPS } from '../core/profile';
import { Reveal } from '../core/reveal';
import { SectionHead } from './section-head';
import { TechIcon } from './tech-icons';

@Component({
  selector: 'dt-stack',
  imports: [SectionHead, Reveal, TechIcon],
  template: `
    <section class="stack" id="stack">
      <div class="shell">
        <dt-section-head
          index="03"
          [label]="t().stackIndex"
          [title]="t().stackTitle"
          [lead]="t().stackLead"
        />

        <div class="groups">
          @for (group of groups; track group.key; let i = $index) {
            <section class="group" [dtReveal]="i * 80">
              <h3 class="eyebrow">{{ label(group.key) }}</h3>
              <ul class="items">
                @for (item of group.items; track item) {
                  <li class="item">
                    <dt-tech-icon class="mark" [name]="item" />
                    <span>{{ item }}</span>
                  </li>
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
      gap: 0.55rem;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.8125rem;
      color: var(--ink-2);
      transition:
        color 0.25s var(--ease),
        transform 0.25s var(--ease-out);
    }

    /* The mark sits a shade back from the label so the type still leads, then
       inks in with the accent on hover — the same gesture the old tick made. */
    .mark {
      flex: none;
      color: var(--ink-3);
      transition:
        color 0.25s var(--ease),
        transform 0.25s var(--ease-out);
    }

    .item:hover {
      color: var(--ink);
      transform: translateX(2px);
    }

    .item:hover .mark {
      color: var(--accent);
      transform: scale(1.08);
    }

    @media (prefers-reduced-motion: reduce) {
      .item,
      .mark {
        transition: color 0.25s var(--ease);
      }

      .item:hover {
        transform: none;
      }

      .item:hover .mark {
        transform: none;
      }
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
