import { Component, inject } from '@angular/core';

import { I18n } from '../core/i18n';
import { PROFILE } from '../core/profile';

@Component({
  selector: 'dt-site-footer',
  template: `
    <footer class="foot">
      <div class="shell inner">
        <p class="line">
          &copy; {{ year }} {{ profile.name }} &middot; {{ t().rights }}
        </p>

        <p class="line built">
          <span class="eyebrow">{{ t().builtWith }}</span>
          {{ t().builtWithValue }}
        </p>
      </div>
    </footer>
  `,
  styles: `
    .foot {
      border-top: 1px solid var(--rule);
      padding-block: 2rem 3rem;
    }

    .inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem 2rem;
    }

    .line {
      font-size: 0.6875rem;
      color: var(--ink-3);
    }

    .built {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.5rem;
    }
  `,
})
export class SiteFooter {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
