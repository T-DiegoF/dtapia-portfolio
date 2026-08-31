import { PLATFORM_ID, Service, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Lang = 'en' | 'es';

const STORAGE_KEY = 'dt.lang';

/**
 * Every string on the site, in both languages. The two maps share their keys,
 * so the compiler flags a translation the moment one side drifts.
 */
const DICTIONARY = {
  en: {
    skipToContent: 'Skip to content',
    role: 'fullstack developer',
    place: 'Buenos Aires',
    availability: 'Open to work',
    navWork: 'Work',
    navStack: 'Stack',
    navAbout: 'About',
    navContact: 'Contact',

    heroLead:
      'I build and modernise systems end to end — micro frontends on Angular, services on NestJS, and the AWS plumbing that keeps them running.',
    heroNote: 'Currently at TheLab Technology, on the La Segunda insurance platform.',

    aboutTitle: 'About',
    aboutIndex: 'Profile',
    aboutBody:
      'I work at a consulting firm serving La Segunda, an Argentine insurance company. My role centres on migrating micro frontends from Angular 14 to Angular 19 and modernising the backend from Node-Express to Node.js with NestJS 11, leaning on AI tooling such as Claude Code along the way.',
    aboutBody2:
      'Most of what I enjoy sits where the frontend meets the infrastructure: clean layering, honest boundaries, and builds that stay fast as a codebase grows.',

    workTitle: 'Selected work',
    workIndex: 'Repositories',
    workLead: 'Public repositories, read live from the GitHub API on every visit.',
    workEmpty: 'No public repositories returned.',
    workLoading: 'Fetching repositories',
    workErrorTitle: 'GitHub is not answering',
    workErrorBody:
      'The repository list could not be loaded. GitHub rate-limits anonymous requests, so this usually clears on its own — try again shortly, or open the profile directly.',
    retry: 'Retry',
    viewProfile: 'View profile on GitHub',

    stackTitle: 'Stack',
    stackIndex: 'Tooling',
    stackLead: 'What I reach for, grouped by where it sits in the system.',
    stackBackend: 'Backend',
    stackFrontend: 'Frontend',
    stackCloud: 'Cloud and DevOps',
    stackAI: 'AI tooling',

    contactTitle: 'Get in touch',
    contactIndex: 'Contact',
    contactLead: 'Open to backend and fullstack roles, contract or full time.',
    emailLabel: 'Email',
    emailRevealHint: 'Click to reveal',
    emailRevealedHint: 'Click again to open your mail client',
    emailRevealAria: 'Reveal email address',
    builtWith: 'Built with',
    builtWithValue: 'Angular 22, zoneless, containerised with Docker',

    repo: 'Repository',
    live: 'Live',
    updated: 'Updated',
    star: 'star',
    starsPlural: 'stars',
    langToggle: 'Cambiar a español',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    rights: 'All rights reserved.',
  },
  es: {
    skipToContent: 'Ir al contenido',
    role: 'desarrollador fullstack',
    place: 'Buenos Aires',
    availability: 'Disponible para trabajar',
    navWork: 'Proyectos',
    navStack: 'Stack',
    navAbout: 'Perfil',
    navContact: 'Contacto',

    heroLead:
      'Construyo y modernizo sistemas de punta a punta: micro frontends en Angular, servicios en NestJS y la infraestructura en AWS que los sostiene.',
    heroNote: 'Actualmente en TheLab Technology, sobre la plataforma de La Segunda.',

    aboutTitle: 'Perfil',
    aboutIndex: 'Perfil',
    aboutBody:
      'Trabajo en una consultora que presta servicios a La Segunda, aseguradora argentina. Mi rol se centra en migrar micro frontends de Angular 14 a Angular 19 y modernizar el backend de Node-Express a Node.js con NestJS 11, apoyándome en herramientas de IA como Claude Code.',
    aboutBody2:
      'Lo que más disfruto está donde el frontend se encuentra con la infraestructura: capas limpias, límites honestos y builds que siguen siendo rápidos a medida que el código crece.',

    workTitle: 'Proyectos',
    workIndex: 'Repositorios',
    workLead: 'Repositorios públicos, leídos en vivo desde la API de GitHub en cada visita.',
    workEmpty: 'No se encontraron repositorios públicos.',
    workLoading: 'Buscando repositorios',
    workErrorTitle: 'GitHub no responde',
    workErrorBody:
      'No se pudo cargar la lista de repositorios. GitHub limita las peticiones anónimas, así que suele resolverse solo — probá de nuevo en un momento o entrá al perfil directamente.',
    retry: 'Reintentar',
    viewProfile: 'Ver perfil en GitHub',

    stackTitle: 'Stack',
    stackIndex: 'Herramientas',
    stackLead: 'Lo que uso, agrupado por dónde vive dentro del sistema.',
    stackBackend: 'Backend',
    stackFrontend: 'Frontend',
    stackCloud: 'Cloud y DevOps',
    stackAI: 'Herramientas de IA',

    contactTitle: 'Hablemos',
    contactIndex: 'Contacto',
    contactLead: 'Abierto a roles backend y fullstack, por contrato o full time.',
    emailLabel: 'Email',
    emailRevealHint: 'Click para revelar',
    emailRevealedHint: 'Click de nuevo para abrir tu cliente de correo',
    emailRevealAria: 'Revelar dirección de email',
    builtWith: 'Hecho con',
    builtWithValue: 'Angular 22, zoneless, containerizado con Docker',

    repo: 'Repositorio',
    live: 'En vivo',
    updated: 'Actualizado',
    star: 'estrella',
    starsPlural: 'estrellas',
    langToggle: 'Switch to English',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    rights: 'Todos los derechos reservados.',
  },
} as const satisfies Record<Lang, Record<string, string>>;

/**
 * Keys are taken from the English map (so a missing translation is a compile
 * error) while the values widen to `string` — otherwise `as const` would pin
 * each entry to its English literal and reject the Spanish one.
 */
export type Dictionary = { readonly [K in keyof (typeof DICTIONARY)['en']]: string };

function initialLang(): Lang {
  if (typeof document === 'undefined') {
    return 'en';
  }
  // index.html resolves the language before first paint; mirror its decision.
  const fromDom = document.documentElement.lang;
  return fromDom === 'es' ? 'es' : 'en';
}

@Service()
export class I18n {
  private readonly _lang = signal<Lang>(initialLang());

  readonly lang = this._lang.asReadonly();
  readonly t = computed<Dictionary>(() => DICTIONARY[this._lang()]);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect(() => {
      const lang = this._lang();
      // There is no document while prerendering, and nothing to persist there.
      if (!this.isBrowser) {
        return;
      }
      document.documentElement.lang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage can be blocked; the toggle still works for this session.
      }
    });
  }

  toggle(): void {
    this._lang.update((lang) => (lang === 'en' ? 'es' : 'en'));
  }
}
