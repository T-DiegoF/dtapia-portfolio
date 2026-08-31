import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { GithubStore } from './core/github';
import { I18n } from './core/i18n';
import type { GithubRepo } from './core/models';

function repo(partial: Partial<GithubRepo> & Pick<GithubRepo, 'id' | 'name'>): GithubRepo {
  return {
    full_name: `T-DiegoF/${partial.name}`,
    html_url: `https://github.com/T-DiegoF/${partial.name}`,
    description: null,
    homepage: null,
    language: 'TypeScript',
    topics: [],
    stargazers_count: 0,
    forks_count: 0,
    private: false,
    fork: false,
    archived: false,
    created_at: '2026-01-01T00:00:00Z',
    pushed_at: '2026-01-01T00:00:00Z',
    ...partial,
  };
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renders the name', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Diego');
    expect(text).toContain('Tapia');
  });
});

describe('I18n', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('swaps the dictionary when toggled', () => {
    const i18n = TestBed.inject(I18n);
    const first = i18n.lang();

    i18n.toggle();

    expect(i18n.lang()).not.toBe(first);
    expect(i18n.t().workTitle).toBeTruthy();
  });
});

describe('GithubStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('drops the profile README repo and forks, and orders featured work first', async () => {
    const store = TestBed.inject(GithubStore);
    const http = TestBed.inject(HttpTestingController);

    // Reading the signal registers the resource; the effect that fires the
    // request runs on the next tick.
    store.projects();
    TestBed.tick();

    const request = http.expectOne((r) => r.url.includes('/users/T-DiegoF/repos'));
    request.flush([
      repo({ id: 1, name: 'T-DiegoF' }),
      repo({ id: 2, name: 'some-fork', fork: true }),
      repo({ id: 3, name: 'jobs-scraper' }),
      repo({ id: 4, name: 'garantya-app' }),
    ]);

    // The resource settles on a microtask before the computed re-runs.
    await Promise.resolve();
    TestBed.tick();

    const names = store.projects().map((p) => p.name);
    expect(names).toEqual(['garantya-app', 'jobs-scraper']);
    expect(store.count()).toBe(2);

    http.verify();
  });
});
