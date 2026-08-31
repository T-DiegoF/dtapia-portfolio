import { Component, inject } from '@angular/core';

import { I18n } from './core/i18n';
import { About } from './ui/about';
import { Contact } from './ui/contact';
import { Hero } from './ui/hero';
import { SiteFooter } from './ui/site-footer';
import { SiteHeader } from './ui/site-header';
import { Stack } from './ui/stack';
import { Work } from './ui/work';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, Work, About, Stack, Contact, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
}
