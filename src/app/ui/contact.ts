import { Component, computed, inject, signal } from '@angular/core';

import { I18n } from '../core/i18n';
import { EMAIL_MASK, PROFILE, contactEmail } from '../core/profile';
import { Reveal } from '../core/reveal';
import { Icon } from './icons';
import { SectionHead } from './section-head';

@Component({
  selector: 'dt-contact',
  imports: [Icon, SectionHead, Reveal],
  template: `
    <section class="contact" id="contact">
      <div class="shell">
        <dt-section-head
          index="04"
          [label]="t().contactIndex"
          [title]="t().contactTitle"
          [lead]="t().contactLead"
        />

        <div class="email-block" [dtReveal]="0">
          @if (email(); as address) {
            <!-- Revealed: a real mailto link, so a second click opens the client. -->
            <a class="email is-revealed" [href]="'mailto:' + address">
              <span class="email-text">{{ address }}</span>
              <dt-icon class="email-arrow" name="arrow" [size]="22" />
            </a>
          } @else {
            <button type="button" class="email" (click)="reveal()" [attr.aria-label]="t().emailRevealAria">
              <span class="email-text masked" aria-hidden="true">{{ mask }}</span>
              <dt-icon class="email-arrow" name="mail" [size]="22" />
            </button>
          }

          <p class="hint" aria-live="polite">
            @if (email()) {
              <span class="hint-on">{{ t().emailRevealedHint }}</span>
            } @else {
              <span>{{ t().emailRevealHint }}</span>
            }
          </p>
        </div>

        <ul class="socials" [dtReveal]="90">
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
        </ul>
      </div>
    </section>
  `,
  styles: `
    .contact {
      padding-block: var(--rhythm);
      border-top: 1px solid var(--rule);
    }

    .email-block {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      align-items: flex-start;
    }

    .email {
      display: inline-flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1.25rem);
      margin-top: 0.5rem;
      padding: 0;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: clamp(1.35rem, 5.2vw, 3.25rem);
      letter-spacing: -0.045em;
      line-height: 1.05;
      text-align: left;
      color: var(--ink);
      word-break: break-word;
      transition: color 0.35s var(--ease);
    }

    .email-text {
      background-image: linear-gradient(var(--accent), var(--accent));
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 0% 2px;
      transition: background-size 0.5s var(--ease-out);
    }

    .email:hover { color: var(--accent); }
    .email:hover .email-text { background-size: 100% 2px; }

    /* The mask sits slightly back so it reads as a placeholder, not an address. */
    .masked {
      color: var(--ink-2);
      letter-spacing: 0.02em;
      user-select: none;
    }

    .email:hover .masked { color: var(--accent); }

    .email-arrow {
      flex: none;
      transition: transform 0.45s var(--ease-out);
    }

    .email:hover .email-arrow { transform: translate(4px, -4px); }

    /* Revealed state gets one quiet entrance so the swap is legible. */
    .is-revealed .email-text {
      animation: unmask 0.5s var(--ease-out) both;
    }

    @keyframes unmask {
      from { opacity: 0; filter: blur(6px); }
      to   { opacity: 1; filter: none; }
    }

    .hint {
      font-size: 0.6875rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-3);
    }

    .hint-on { color: var(--accent); }

    .socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.75rem;
      padding-top: clamp(1.5rem, 3vw, 2.25rem);
      font-size: 0.8125rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .is-revealed .email-text { animation: none; }
    }
  `,
})
export class Contact {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly profile = PROFILE;
  protected readonly mask = EMAIL_MASK;

  private readonly revealed = signal(false);

  /** `null` until revealed — the address is not assembled before that. */
  protected readonly email = computed(() => (this.revealed() ? contactEmail() : null));

  protected reveal(): void {
    this.revealed.set(true);
  }
}
