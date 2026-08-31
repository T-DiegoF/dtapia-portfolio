import { Component, computed, input } from '@angular/core';

import { TECH_GLYPHS, type Glyph, type TechName } from './tech-glyphs';

/**
 * A mark for one stack entry. Everything renders in `currentColor` rather than
 * brand colour: the section is set in a single ink, and twenty-one palettes
 * would shout over the type.
 */
@Component({
  selector: 'dt-tech-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="glyph().viewBox ?? '0 0 24 24'"
      [attr.fill]="glyph().stroke ? 'none' : 'currentColor'"
      [attr.stroke]="glyph().stroke ? 'currentColor' : null"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path [attr.d]="glyph().d" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    svg {
      display: block;
    }
  `,
})
export class TechIcon {
  readonly name = input.required<TechName>();
  readonly size = input(14);

  protected readonly glyph = computed<Glyph>(() => TECH_GLYPHS[this.name()]);
}
