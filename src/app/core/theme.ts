import { PLATFORM_ID, Service, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'dt.theme';

function initialTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }
  // index.html resolves the theme before first paint; mirror its decision so
  // the store never disagrees with the ground already painted.
  return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
}

@Service()
export class ThemeStore {
  private readonly _theme = signal<Theme>(initialTheme());

  readonly theme = this._theme.asReadonly();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect(() => {
      const theme = this._theme();
      // There is no document while prerendering; index.html paints the
      // stored theme before the app boots anyway.
      if (!this.isBrowser) {
        return;
      }
      document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage blocked — the choice simply will not persist.
      }
    });
  }

  toggle(): void {
    this._theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
