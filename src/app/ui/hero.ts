import { Component, inject } from '@angular/core';

import { I18n } from '../core/i18n';
import { PROFILE } from '../core/profile';
import { Icon } from './icons';

@Component({
  selector: 'dt-hero',
  imports: [Icon],
  template: `
    <section class="hero" id="top">
      <div class="shell">
        <p class="eyebrow line" style="--delay: 40ms">
          {{ t().role }} <span class="dot">·</span> {{ t().place }}
        </p>

        <h1 class="name">
          <span class="word solid" style="--delay: 0ms">Diego</span>
          <span class="word hollow" style="--delay: 90ms">Tapia</span>
        </h1>

        <hr class="rule rule-draw" style="--delay: 260ms" />

        <div class="grid">
          <p class="prose lead line" style="--delay: 150ms">{{ t().heroLead }}</p>

          <div class="meta line" style="--delay: 260ms">
            <p class="avail">
              <span class="pulse" aria-hidden="true"></span>
              {{ t().availability }}
            </p>
            <p class="note">{{ t().heroNote }}</p>

            <ul class="links">
              <li>
                <a class="link" [href]="profile.github" target="_blank" rel="noopener noreferrer">
                  <dt-icon name="github" [size]="14" />GitHub
                </a>
              </li>
              <li>
                <a class="link" [href]="profile.linkedin" target="_blank" rel="noopener noreferrer">
                  <dt-icon name="linkedin" [size]="14" />LinkedIn
                </a>
              </li>
              <li>
                <!-- Points at the contact section rather than a mailto:, so the
                     address stays out of the DOM until it is revealed there. -->
                <a class="link" href="#contact">
                  <dt-icon name="mail" [size]="14" />{{ t().emailLabel }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p class="rail" aria-hidden="true">34.6037&deg; S &nbsp;/&nbsp; 58.3816&deg; W</p>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      padding-block: clamp(3rem, 7vw, 5.5rem) clamp(2.25rem, 5vw, 3.5rem);
    }

    /* Everything in the hero rises on load rather than on scroll — it is
       already in view, so it gets one orchestrated entrance.

       Like the headline, none of it fades: the lead paragraph is the element
       Chrome measures for LCP, and an opacity ramp means it counts as unpainted
       until the ramp finishes. Sliding keeps the entrance without that cost, so
       the hero settles into place while the sections below still fade in on
       scroll. */
    .line {
      animation: rise-name 0.75s var(--ease-out) both;
      animation-delay: var(--delay, 0ms);
    }

    .dot { color: var(--accent); }

    .name {
      margin-block: clamp(0.75rem, 2vw, 1.25rem) clamp(1.75rem, 4vw, 2.75rem);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(3.4rem, 14vw, 10.5rem);
      line-height: 0.84;
      letter-spacing: -0.055em;
      display: flex;
      flex-direction: column;
    }

    /* The name is the LCP element, so it must never animate its opacity:
       a fade from 0 delays the paint Chrome measures. Sliding it instead
       keeps the entrance while letting the text land at full opacity on the
       first frame. */
    @keyframes rise-name {
      from { transform: translate3d(0, 16px, 0); }
      to   { transform: none; }
    }

    .word {
      display: block;
      animation: rise-name 0.7s var(--ease-out) both;
      animation-delay: var(--delay, 0ms);
    }

    .solid { color: var(--ink); }

    /* The outlined second word is the hero's signature; it inks in on hover. */
    .hollow {
      margin-left: clamp(1.5rem, 7vw, 6rem);
      color: transparent;
      -webkit-text-stroke: 1.5px var(--ink);
      transition: color 0.55s var(--ease-out), -webkit-text-stroke-color 0.55s var(--ease-out);
    }

    .name:hover .hollow {
      color: var(--accent);
      -webkit-text-stroke-color: var(--accent);
    }

    @media (max-width: 560px) {
      /* A hairline stroke gets illegible at small sizes — fall back to solid. */
      .hollow {
        color: var(--ink);
        -webkit-text-stroke-width: 0;
      }
      .name:hover .hollow { color: var(--accent); }
    }

    .grid {
      display: grid;
      gap: clamp(2rem, 5vw, 3.5rem);
      padding-top: clamp(1.75rem, 4vw, 2.75rem);
    }

    @media (min-width: 900px) {
      .grid {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
        align-items: start;
      }
    }

    .lead {
      font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
      color: var(--ink-2);
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .avail {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.6875rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink);
    }

    .pulse {
      position: relative;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
      flex: none;
    }

    .pulse::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid var(--accent);
      opacity: 0;
      animation: ping 2.6s var(--ease-out) infinite;
    }

    @keyframes ping {
      0%   { opacity: 0.7; transform: scale(0.6); }
      70%  { opacity: 0;   transform: scale(1.5); }
      100% { opacity: 0;   transform: scale(1.5); }
    }

    .note {
      font-size: 0.8125rem;
      color: var(--ink-3);
      max-width: 34ch;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem 1.5rem;
      padding-top: 0.5rem;
      font-size: 0.8125rem;
    }

    /* Rotated coordinate strip pinned to the right edge — an editorial margin
       note. Hidden where there is no room for it. */
    .rail {
      display: none;
    }

    @media (min-width: 1180px) {
      .rail {
        display: block;
        position: absolute;
        top: 50%;
        right: calc(var(--gutter) / 2 - 0.5rem);
        transform: rotate(90deg) translateX(-50%);
        transform-origin: right center;
        font-size: 0.625rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: var(--ink-3);
        white-space: nowrap;
        opacity: 0;
        animation: rise 1s var(--ease-out) 800ms both;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .line, .word, .rail { animation: none; opacity: 1; }
      .pulse::after { animation: none; }
    }
  `,
})
export class Hero {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly profile = PROFILE;
}
