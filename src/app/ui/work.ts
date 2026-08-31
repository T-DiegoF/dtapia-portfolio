import { Component, inject } from '@angular/core';

import { GITHUB_PROFILE, GITHUB_USER, GithubStore } from '../core/github';
import { I18n } from '../core/i18n';
import { Reveal } from '../core/reveal';
import { Icon } from './icons';
import { RepoRow } from './repo-row';
import { SectionHead } from './section-head';

@Component({
  selector: 'dt-work',
  imports: [Icon, RepoRow, SectionHead, Reveal],
  template: `
    <section class="work" id="work">
      <div class="shell">
        <dt-section-head index="01" [label]="t().workIndex" [title]="t().workTitle" [lead]="t().workLead" />

        <!-- The request itself, printed. The data is live, so the readout is too. -->
        <p class="readout" [dtReveal]="0" aria-live="polite">
          <span class="verb">GET</span>
          <span class="path">/users/{{ user }}/repos</span>
          <span class="arrow" aria-hidden="true">&rarr;</span>
          @if (store.isLoading()) {
            <span class="pending">{{ t().workLoading }}<span class="caret" aria-hidden="true"></span></span>
          } @else if (store.error()) {
            <span class="failed">error</span>
          } @else {
            <span class="ok">{{ store.status() }}</span>
            <span class="count">{{ store.count() }} {{ t().workIndex.toLowerCase() }}</span>
          }
        </p>

        @if (store.error()) {
          <div class="state error" [dtReveal]="0">
            <h3 class="state-title">{{ t().workErrorTitle }}</h3>
            <p class="prose">{{ t().workErrorBody }}</p>
            <div class="state-actions">
              <button type="button" class="btn" (click)="store.reload()">{{ t().retry }}</button>
              <a class="link" [href]="profileUrl" target="_blank" rel="noopener noreferrer">
                {{ t().viewProfile }}
                <dt-icon name="arrow" [size]="12" />
              </a>
            </div>
          </div>
        } @else if (store.isLoading()) {
          <ul class="skeletons" aria-hidden="true">
            @for (row of placeholders; track row) {
              <li class="skeleton" [style.--delay.ms]="row * 90">
                <span class="sk sk-num"></span>
                <span class="sk-body">
                  <span class="sk sk-title"></span>
                  <span class="sk sk-line"></span>
                  <span class="sk sk-line"></span>
                  <span class="sk sk-line short"></span>
                  <span class="sk-chips">
                    @for (chip of chipPlaceholders; track chip) {
                      <span class="sk sk-chip"></span>
                    }
                  </span>
                </span>
                <span class="sk-aside">
                  <span class="sk sk-year"></span>
                  <span class="sk sk-meta"></span>
                </span>
              </li>
            }
          </ul>
        } @else if (store.count() === 0) {
          <div class="state" [dtReveal]="0">
            <p class="prose">{{ t().workEmpty }}</p>
          </div>
        } @else {
          <ol class="index">
            @for (project of store.projects(); track project.id; let i = $index) {
              <li [dtReveal]="i * 70">
                <dt-repo-row [project]="project" [index]="i" />
              </li>
            }
          </ol>

          <p class="outro" [dtReveal]="80">
            <a class="link" [href]="profileUrl" target="_blank" rel="noopener noreferrer">
              <dt-icon name="github" [size]="14" />
              {{ t().viewProfile }}
            </a>
          </p>
        }
      </div>
    </section>
  `,
  styles: `
    .work {
      padding-block: var(--rhythm);
      border-top: 1px solid var(--rule);
    }

    .readout {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 0.9rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--rule);
      border-radius: 4px;
      background: var(--paper-2);
      font-size: 0.6875rem;
      color: var(--ink-3);
    }

    .verb { color: var(--accent); font-weight: 600; letter-spacing: 0.06em; }
    .path { color: var(--ink-2); }
    .arrow { opacity: 0.5; }
    .ok { color: var(--ink); font-weight: 500; }
    .failed { color: var(--accent); font-weight: 500; }
    .pending { color: var(--ink-2); }

    .count::before { content: '·'; margin-right: 0.5rem; opacity: 0.5; }

    .caret {
      display: inline-block;
      width: 6px;
      height: 12px;
      margin-left: 3px;
      vertical-align: -1px;
      background: var(--accent);
      animation: blink 1.1s steps(1, end) infinite;
    }

    .index { border-bottom: 1px solid var(--rule); }

    .outro { padding-top: 1.75rem; font-size: 0.8125rem; }

    /* ---- states ---- */
    .state {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border: 1px solid var(--rule);
      border-radius: 4px;
      background: var(--paper-2);
    }

    .error { border-left: 2px solid var(--accent); }

    .state-title {
      font-size: 1.125rem;
      letter-spacing: -0.02em;
    }

    .state-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.8125rem;
    }

    .btn {
      height: 2.1rem;
      padding-inline: 1rem;
      border: 1px solid var(--ink);
      border-radius: 999px;
      font-size: 0.75rem;
      color: var(--ink);
      transition: background-color 0.25s var(--ease), color 0.25s var(--ease);
    }

    .btn:hover { background: var(--ink); color: var(--paper); }

    /* ---- loading ----
       The skeleton mirrors dt-repo-row's grid and reserves a row's real height.
       It used to be four short rows (664px) standing in for five full ones
       (1454px), so when the repositories arrived everything below them jumped
       790px. On a deep link like /#contact that shift is the whole viewport:
       it measured 0.63 CLS. Reserving the space keeps the page still. */
    .skeletons { border-bottom: 1px solid var(--rule); }

    /* A real row is taller the narrower the viewport gets, because the summary
       wraps over more lines. Measured against the live content: ~476px on a
       phone, ~400px at tablet width, ~290px once the three-column layout kicks
       in. These reserve that space so nothing below the list moves when the
       repositories arrive. Worth re-measuring if the project copy changes
       length or a repository is added. */
    .skeleton {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
      min-height: 29.75rem;
      padding-block: clamp(1.75rem, 3.5vw, 2.75rem);
      border-top: 1px solid var(--rule);
    }

    @media (min-width: 600px) {
      .skeleton { min-height: 25rem; }
    }

    @media (min-width: 860px) {
      .skeleton {
        grid-template-columns: 4.5rem minmax(0, 1fr) 13rem;
        gap: 2rem;
        min-height: 18.125rem;
        padding-inline: 1rem;
        margin-inline: -1rem;
      }
    }

    .sk-body { display: flex; flex-direction: column; gap: 0.85rem; }

    .sk-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.15rem; }

    .sk-aside { display: flex; flex-direction: column; gap: 0.75rem; }

    @media (min-width: 860px) {
      .sk-aside { align-items: flex-end; }
    }

    .sk {
      display: block;
      border-radius: 3px;
      background: linear-gradient(
        90deg,
        var(--paper-3) 0%,
        color-mix(in srgb, var(--paper-3) 45%, var(--paper)) 50%,
        var(--paper-3) 100%
      );
      background-size: 220% 100%;
      animation: sweep 1.5s var(--ease) infinite;
      animation-delay: var(--delay, 0ms);
    }

    .sk-num { width: 1.6rem; height: 0.7rem; margin-top: 0.4rem; }
    .sk-title { width: min(45%, 14rem); height: 2.25rem; }
    .sk-line { width: 100%; height: 0.8rem; }
    .sk-line.short { width: 62%; }
    .sk-chip { width: 4.5rem; height: 1.35rem; border-radius: 999px; }
    .sk-year { width: 2.75rem; height: 0.95rem; }
    .sk-meta { width: 6.5rem; height: 0.7rem; }

    @keyframes sweep {
      from { background-position: 120% 0; }
      to   { background-position: -120% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .sk, .caret { animation: none; }
    }
  `,
})
export class Work {
  /** Five rows, matching the number of public repositories the API returns. */
  protected readonly placeholders = [0, 1, 2, 3, 4];
  protected readonly chipPlaceholders = [0, 1, 2, 3, 4];

  protected readonly store = inject(GithubStore);
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly user = GITHUB_USER;
  protected readonly profileUrl = GITHUB_PROFILE;
}
