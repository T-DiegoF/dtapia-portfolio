import { Component, computed, inject } from '@angular/core';

import { I18n } from '../core/i18n';
import { PROFILE } from '../core/profile';
import { ThemeStore } from '../core/theme';
import { Icon } from './icons';

@Component({
  selector: 'dt-site-header',
  imports: [Icon],
  template: `
    <header class="bar">
      <div class="shell inner">
        <a class="mark" href="#top">
          <span class="mark-initials" aria-hidden="true">{{ profile.initials }}</span>
          <span class="mark-dot" aria-hidden="true"></span>
          <span class="visually-hidden">{{ profile.name }}</span>
        </a>

        <nav class="nav" [attr.aria-label]="t().navWork">
          <a class="nav-link" href="#work">{{ t().navWork }}</a>
          <a class="nav-link" href="#about">{{ t().navAbout }}</a>
          <a class="nav-link" href="#stack">{{ t().navStack }}</a>
          <a class="nav-link" href="#contact">{{ t().navContact }}</a>
        </nav>

        <div class="controls">
          <button
            type="button"
            class="toggle lang"
            (click)="i18n.toggle()"
            [attr.aria-label]="t().langToggle"
            [attr.title]="t().langToggle"
          >
            <span aria-hidden="true" [class.on]="i18n.lang() === 'en'">EN</span>
            <span class="sep" aria-hidden="true">/</span>
            <span aria-hidden="true" [class.on]="i18n.lang() === 'es'">ES</span>
          </button>

          <button
            type="button"
            class="toggle icon-only"
            (click)="theme.toggle()"
            [attr.aria-label]="themeLabel()"
            [attr.title]="themeLabel()"
          >
            <dt-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="14" />
          </button>
        </div>
      </div>
      <hr class="rule" />
    </header>
  `,
  styles: `
    .bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: color-mix(in srgb, var(--paper) 82%, transparent);
      backdrop-filter: blur(14px) saturate(1.3);
      -webkit-backdrop-filter: blur(14px) saturate(1.3);
    }

    .inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      height: 3.75rem;
    }

    .mark {
      display: inline-flex;
      align-items: baseline;
      gap: 0.2rem;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: -0.04em;
      color: var(--ink);
    }

    .mark-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent);
      transition: transform 0.4s var(--ease-out);
    }

    .mark:hover .mark-dot { transform: translateY(-3px) scale(1.25); }

    .nav {
      display: none;
      gap: 1.75rem;
    }

    @media (min-width: 780px) {
      .nav { display: flex; }
    }

    .nav-link {
      position: relative;
      font-size: 0.75rem;
      color: var(--ink-2);
      transition: color 0.25s var(--ease);
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 100%;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.35s var(--ease-out);
    }

    .nav-link:hover { color: var(--ink); }
    .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      height: 1.9rem;
      padding-inline: 0.6rem;
      border: 1px solid var(--rule);
      border-radius: 999px;
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--ink-3);
      transition: border-color 0.25s var(--ease), color 0.25s var(--ease);
    }

    .toggle:hover { border-color: var(--ink-3); color: var(--ink); }

    .icon-only { padding-inline: 0.55rem; }

    .lang .on { color: var(--ink); }
    .lang .sep { opacity: 0.45; }
  `,
})
export class SiteHeader {
  protected readonly i18n = inject(I18n);
  protected readonly theme = inject(ThemeStore);
  protected readonly profile = PROFILE;
  protected readonly t = this.i18n.t;

  protected readonly themeLabel = computed(() =>
    this.theme.theme() === 'dark' ? this.t().themeToLight : this.t().themeToDark,
  );
}
