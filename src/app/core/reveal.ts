import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Reveals an element on first scroll into view.
 *
 * The element carries `.rise` from the moment it renders (so it starts hidden
 * without a flash) and gains `.is-in` when it crosses the viewport, which is
 * what actually starts the animation. `dtReveal` is the stagger delay in ms.
 */
@Directive({
  selector: '[dtReveal]',
  host: { class: 'rise' },
})
export class Reveal {
  readonly delay = input(0, { alias: 'dtReveal', transform: numberAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.host.nativeElement;
      el.style.setProperty('--delay', `${this.delay()}ms`);

      // Without IntersectionObserver, show everything rather than nothing.
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-in');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target);
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );

      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
