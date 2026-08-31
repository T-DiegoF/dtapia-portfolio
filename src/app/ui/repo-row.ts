import { Component, computed, inject, input } from '@angular/core';

import { I18n } from '../core/i18n';
import type { Project } from '../core/models';
import { Icon } from './icons';

@Component({
  selector: 'dt-repo-row',
  imports: [Icon],
  host: { class: 'row' },
  template: `
    <span class="bar" aria-hidden="true"></span>

    <p class="num">{{ ordinal() }}</p>

    <div class="body">
      <div class="head">
        <h3 class="title">
          <a [href]="project().repoUrl" target="_blank" rel="noopener noreferrer">
            {{ project().title }}
            <dt-icon class="head-arrow" name="arrow" [size]="15" />
          </a>
        </h3>
        <p class="repo-name">{{ project().name }}</p>
      </div>

      @if (project().summary) {
        <p class="prose summary">{{ project().summary }}</p>
      }

      @if (project().stack.length) {
        <ul class="stack">
          @for (item of project().stack; track item) {
            <li class="chip">{{ item }}</li>
          }
        </ul>
      }
    </div>

    <div class="aside">
      <p class="year">{{ project().year }}</p>

      <ul class="facts">
        @if (project().stars > 0) {
          <li class="fact">
            <dt-icon name="star" [size]="12" />
            {{ project().stars }}
            {{ project().stars === 1 ? t().star : t().starsPlural }}
          </li>
        }
        <li class="fact">{{ t().updated }} {{ updated() }}</li>
      </ul>

      <ul class="actions">
        <li>
          <a class="link" [href]="project().repoUrl" target="_blank" rel="noopener noreferrer">
            {{ t().repo }}
          </a>
        </li>
        @if (project().liveUrl; as live) {
          <li>
            <a class="link live" [href]="live" target="_blank" rel="noopener noreferrer">
              {{ t().live }}
              <dt-icon name="arrow" [size]="12" />
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
      padding: clamp(1.75rem, 3.5vw, 2.75rem) 0;
      border-top: 1px solid var(--rule);
      transition: background-color 0.4s var(--ease);
    }

    @media (min-width: 860px) {
      :host {
        grid-template-columns: 4.5rem minmax(0, 1fr) 13rem;
        gap: 2rem;
        align-items: start;
        padding-inline: 1rem;
        margin-inline: -1rem;
      }
    }

    :host(:hover) { background: var(--accent-wash); }

    /* Accent rule that draws across the top edge on hover. */
    .bar {
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.5s var(--ease-out);
    }

    :host(:hover) .bar { transform: scaleX(1); }

    .num { padding-top: 0.4rem; }

    .body {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      min-width: 0;
    }

    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.35rem 0.9rem;
    }

    .title {
      font-size: clamp(1.5rem, 3.4vw, 2.25rem);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .title a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--ink);
      transition: color 0.3s var(--ease);
    }

    .title a:hover { color: var(--accent); }

    .head-arrow {
      opacity: 0;
      transform: translate(-4px, 4px);
      transition: opacity 0.35s var(--ease), transform 0.35s var(--ease-out);
    }

    :host(:hover) .head-arrow { opacity: 1; transform: none; }

    .repo-name {
      font-size: 0.6875rem;
      color: var(--ink-3);
    }

    .repo-name::before { content: '/'; margin-right: 0.25rem; opacity: 0.5; }

    .summary { font-size: 0.8125rem; }

    .stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding-top: 0.15rem;
    }

    :host(:hover) .chip { border-color: color-mix(in srgb, var(--accent) 45%, var(--rule)); }

    .aside {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    @media (min-width: 860px) {
      .aside { align-items: flex-end; text-align: right; }
    }

    .year {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9375rem;
      letter-spacing: -0.02em;
      color: var(--ink-3);
      font-variant-numeric: tabular-nums;
    }

    .facts {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.6875rem;
      color: var(--ink-3);
    }

    .fact {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    @media (min-width: 860px) {
      .facts { align-items: flex-end; }
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem 1rem;
      padding-top: 0.25rem;
      font-size: 0.75rem;
    }

    .live { color: var(--accent); }
  `,
})
export class RepoRow {
  readonly project = input.required<Project>();
  readonly index = input.required<number>();

  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;

  protected readonly ordinal = computed(() =>
    String(this.index() + 1).padStart(2, '0'),
  );

  /** Last push, rendered in the reader's language (e.g. "Apr 2026"). */
  protected readonly updated = computed(() => {
    const locale = this.i18n.lang() === 'es' ? 'es-AR' : 'en-GB';
    const date = new Date(this.project().pushedAt);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
    }).format(date);
  });
}
