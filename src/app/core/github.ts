import { PLATFORM_ID, Service, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { httpResource } from '@angular/common/http';

import { I18n, type Lang } from './i18n';
import type { GithubRepo, Project } from './models';

export const GITHUB_USER = 'T-DiegoF';
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;

const REPOS_URL =
  `https://api.github.com/users/${GITHUB_USER}/repos` + '?per_page=100&sort=updated&type=owner';

/**
 * The special `<user>/<user>` repository only holds the profile README, so it
 * is not a project and never belongs in the index.
 */
const PROFILE_REPO = GITHUB_USER.toLowerCase();

interface RepoCopy {
  readonly order: number;
  readonly title: string;
  readonly summary: Record<Lang, string>;
  readonly stack: readonly string[];
  readonly liveUrl?: string;
}

/**
 * Locally authored copy for each repository. GitHub descriptions are short or
 * absent, so the prose lives here while every other field on the card — stars,
 * language, last push, URLs — still comes straight from the API. Anything not
 * listed here still renders, falling back to the GitHub description.
 */
const COPY: Record<string, RepoCopy> = {
  'garantya-app': {
    order: 1,
    title: 'GarantYa',
    summary: {
      en: 'On-chain escrow for rental security deposits on Avalanche. The tenant locks funds in a per-rental contract; at the end of the tenancy the landlord proposes a split, and the tenant can accept it, reject it into arbitration, or reclaim the money automatically if no proposal ever arrives.',
      es: 'Depósitos de alquiler en garantía on-chain sobre Avalanche. El inquilino bloquea los fondos en un contrato por alquiler; al terminar el contrato el propietario propone un reparto, y el inquilino puede aceptarlo, rechazarlo para ir a arbitraje, o recuperar el dinero automáticamente si esa propuesta nunca llega.',
    },
    stack: ['Next.js', 'Solidity', 'Hardhat', 'wagmi', 'viem', 'Supabase', 'Avalanche'],
    liveUrl: 'https://garantya.vercel.app',
  },
  cuida: {
    order: 2,
    title: 'Cuida',
    summary: {
      en: 'A social health platform connecting volunteer doctors, patients and donors. Patients post medical requests and open fundraising campaigns, volunteer doctors answer them, and donors back a campaign through a guided donation flow — each of the three roles getting its own dashboard. Built as a working demo, interface in Portuguese.',
      es: 'Una plataforma social de salud que conecta médicos voluntarios, pacientes y donantes. Los pacientes publican pedidos médicos y abren campañas de recaudación, los médicos voluntarios los responden, y los donantes apoyan una campaña con un flujo de donación guiado, cada uno de los tres roles con su propio panel. Construido como demo funcional, con la interfaz en portugués.',
    },
    stack: ['Next.js 14', 'TypeScript', 'Supabase', 'Tailwind CSS', 'React'],
  },
  'jobs-scraper': {
    order: 3,
    title: 'Job Scraper',
    summary: {
      en: 'Scrapes backend and Node.js openings off Bumeran, Computrabajo and ZonaJobs, then lays them out in a single grid — so an active job search stops living across a dozen browser tabs.',
      es: 'Busca avisos de backend y Node.js en Bumeran, Computrabajo y ZonaJobs, y los junta en una sola grilla, para que una búsqueda activa deje de vivir repartida en doce pestañas.',
    },
    stack: ['Next.js', 'TypeScript', 'Playwright', 'Puppeteer', 'Cheerio', 'MongoDB'],
    liveUrl: 'https://jobs-scraper-wine.vercel.app',
  },
  lucky: {
    order: 4,
    title: 'NestJS Backend Archetype',
    summary: {
      en: 'A backend challenge grown into a reusable NestJS starting point: register and login endpoints issuing JWTs, a profile endpoint behind the token, TypeORM over MySQL with Redis caching, Swagger docs, and a Docker entrypoint that seeds the reference tables.',
      es: 'Un challenge backend convertido en punto de partida reutilizable para NestJS: endpoints de registro y login que emiten JWT, un endpoint de perfil detrás del token, TypeORM sobre MySQL con caché en Redis, documentación en Swagger y un entrypoint de Docker que siembra las tablas de referencia.',
    },
    stack: ['NestJS', 'TypeORM', 'MySQL', 'Redis', 'JWT', 'Swagger', 'Docker'],
  },
  'challenge-personal-pay': {
    order: 5,
    title: 'Weather API',
    summary: {
      en: 'A technical challenge for Personal Pay. An Express API exposing three weather endpoints over OpenWeatherMap, resolving the caller location by IP when no city is given, and covered end to end with Jest and Supertest.',
      es: 'Un challenge técnico para Personal Pay. Una API en Express con tres endpoints de clima sobre OpenWeatherMap, que resuelve la ubicación por IP cuando no se pasa una ciudad, y cubierta de punta a punta con Jest y Supertest.',
    },
    stack: ['Express', 'Node.js', 'Jest', 'Supertest', 'Swagger'],
  },
};

@Service()
export class GithubStore {
  private readonly i18n = inject(I18n);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Live repository list. Angular re-fetches whenever `reload()` is called.
   *
   * The URL is withheld during prerendering (a `undefined` url leaves the
   * resource idle), so the build never calls GitHub. Baking the response into
   * the HTML would make the list as stale as the last deploy and would put a
   * rate-limited third party on the critical path of the build.
   */
  private readonly repos = httpResource<GithubRepo[]>(
    () => (this.isBrowser ? REPOS_URL : undefined),
    { defaultValue: [] },
  );

  /**
   * True while the list is unknown — which includes prerendering, where the
   * request is deliberately not made. Without the platform check the server
   * would render the "no repositories" state into the HTML and the client
   * would then swap it for a full-height skeleton, shifting everything below
   * it by the height of the whole list.
   */
  readonly isLoading = computed(() => !this.isBrowser || this.repos.isLoading());
  readonly error = computed(() => this.repos.error() ?? null);

  /**
   * Public, non-fork repositories merged with their local copy and ordered so
   * the featured work leads. The `/users/:user/repos` endpoint only ever
   * returns public repositories, and the private guard keeps that explicit.
   */
  readonly projects = computed<Project[]>(() => {
    const lang = this.i18n.lang();

    return this.repos
      .value()
      .filter(
        (repo) =>
          !repo.private && !repo.fork && repo.name.toLowerCase() !== PROFILE_REPO,
      )
      .map((repo) => {
        const copy = COPY[repo.name];
        return {
          id: repo.id,
          name: repo.name,
          title: copy?.title ?? repo.name,
          summary: copy?.summary[lang] ?? repo.description ?? '',
          stack: copy?.stack ?? (repo.language ? [repo.language] : []),
          language: repo.language,
          repoUrl: repo.html_url,
          liveUrl: copy?.liveUrl ?? (repo.homepage?.trim() || null),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          pushedAt: repo.pushed_at,
          year: repo.created_at.slice(0, 4),
        } satisfies Project;
      })
      .sort((a, b) => {
        const orderA = COPY[a.name]?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = COPY[b.name]?.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return b.pushedAt.localeCompare(a.pushedAt);
      });
  });

  readonly count = computed(() => this.projects().length);

  /** Short status line for the terminal readout in the work section. */
  readonly status = computed(() => {
    if (this.isLoading()) return 'pending';
    if (this.error()) return 'failed';
    return `200 OK`;
  });

  reload(): void {
    this.repos.reload();
  }
}
