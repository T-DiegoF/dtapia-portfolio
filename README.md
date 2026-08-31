# dtapia-portfolio

Personal portfolio for **Diego Tapia** — fullstack developer, Buenos Aires.
Built with **Angular 22** (zoneless, standalone, signals) and served from Docker.

The project index is not hardcoded: it is read live from the GitHub REST API on
every visit, filtered to public, non-fork repositories.

- Live: https://dtapia-dev.vercel.app/
- Source of the project list: https://api.github.com/users/T-DiegoF/repos

---

## Requirements

Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`.

This machine runs **Node 24.19.0 (LTS Krypton)**, which satisfies it, so `ng` works
directly on the host. Docker still pins its own Node 24.20.0 for builds, so the
container output does not depend on whatever the host happens to have installed.

---

## Running it

### Development — hot reload on http://localhost:4200

```bash
docker compose up dev
```

Source is bind-mounted, so edits on the host reload in the browser.
`node_modules` and `.angular` live in named volumes so the host never shadows the
container's install.

### Production — nginx on http://localhost:8080

```bash
docker compose up web --build
```

Multi-stage build: dependencies, then `ng build --configuration production`, then
a ~50 MB nginx image serving the static output with SPA fallback, gzip, immutable
asset caching and basic security headers.

### Tests

```bash
docker compose run --rm dev npx ng test --watch=false
```

> Running the Vitest suite against the **bind-mounted** source on Windows can time
> out the worker pool — the mount is too slow. Build the image and run the tests
> inside it instead:
>
> ```bash
> docker build -f Dockerfile.dev -t dtapia-dev .
> docker run --rm dtapia-dev npx ng test --watch=false
> ```

---

## Architecture

```
src/app/
├── core/
│   ├── github.ts      GithubStore — httpResource over the GitHub API,
│   │                  merged with locally authored project copy
│   ├── i18n.ts        I18n — EN/ES dictionary behind a signal
│   ├── theme.ts       ThemeStore — light/dark, persisted
│   ├── profile.ts     Contact details and the stack groups
│   ├── models.ts      GithubRepo / Project types
│   └── reveal.ts      [dtReveal] — IntersectionObserver scroll animation
└── ui/
    ├── site-header.ts hero.ts work.ts repo-row.ts
    ├── about.ts stack.ts contact.ts site-footer.ts
    └── section-head.ts icons.ts
```

**Zoneless.** Angular 22 defaults to it — there is no `zone.js` in the bundle and
every component is `OnPush`. State is signals throughout; `httpResource` drives
the repository list, so `reload()` on the retry button re-issues the request with
no manual subscription management.

**Prerendered.** `outputMode: "static"` renders the page to HTML at build time
and the client hydrates it, so the hero is in the served markup instead of
waiting on the JS bundle. There is no Node server — the output is static files
and nginx serves them. The GitHub call is deliberately withheld during
prerendering (`isPlatformBrowser` gates the URL), so the repository list stays
genuinely live rather than frozen at deploy time.

**Language is a choice, not a guess.** The prerendered HTML is English. Sniffing
`navigator.language` would make the page paint in English and then visibly
rewrite itself on hydration for Spanish speakers — a real flash, and it showed up
as layout shift. The header toggle sets the language and `localStorage` remembers
it.

**Project copy.** GitHub descriptions are short or missing, so `core/github.ts`
holds an authored bilingual blurb and stack list per repository. Everything else
on a card — stars, primary language, last push, URLs — comes from the API. A repo
with no entry still renders, falling back to its GitHub description.

**Rate limits.** The page makes exactly one anonymous API call per load. GitHub
allows 60/hour per IP; if that is exhausted the section shows an error state with
a retry and a direct link to the profile.

---

## Design

Editorial letterpress meets terminal readout: warm paper ground, **Syne** at
800 for display, **Fira Code** as the system voice, and hairline rules that
organise the page like a printed catalogue. Projects are a numbered index rather
than a card grid.

- Light and dark, resolved before first paint in `index.html` so the paper never
  flashes; the choice persists in `localStorage`.
- Bilingual EN/ES with a header toggle, defaulting to English.
- Body text meets WCAG AA in both themes.
- Everything honours `prefers-reduced-motion`.
- Fonts are self-hosted from `public/fonts/` (both are SIL Open Font License),
  with metric-matched fallbacks so a swap does not reflow the page.
- The hero's entrance slides rather than fades: the lead paragraph is the LCP
  element, and an opacity ramp makes Chrome count it as unpainted until it ends.

---

## Routes

There is no client-side router. The site is one prerendered document; the header
links are in-page anchors, not routes.

| URL | Serves |
|---|---|
| `/` | the page (prerendered `index.html`) |
| `/#top` `/#work` `/#about` `/#stack` `/#contact` | the same document — anchors |
| `/robots.txt` `/sitemap.xml` `/favicon.svg` `/fonts/*` | static assets |
| anything else | **404** with `404.html` |

That last row matters. A catch-all rewrite to `index.html` — the usual SPA
default, and what this project started with — answers every made-up URL with the
homepage and a `200`. Search engines read that as duplicate content on infinitely
many URLs. With no router there is nothing to fall back for, so unknown paths get
a real 404 instead, in both `nginx.conf` and `vercel.json`.

### Lighthouse

Audited per route against the production container, desktop and mobile:

| Route | Desktop | Mobile |
|---|---|---|
| `/` | 100 / 100 / 100 / 100 | 96-99 / 100 / 100 / 100 |
| `/#top` `/#work` `/#about` `/#stack` `/#contact` | 99-100 / 100 / 100 / 100 | 94-96 / 100 / 100 / 100 |

*(performance / accessibility / best practices / SEO)*

CLS is 0 on every route. The mobile performance spread is LCP moving between 2.0s
and 2.9s under Lighthouse's simulated throttling while FCP stays pinned at 1.2s —
run to run variance, not a regression.

Auditing the anchors is what surfaced the two real bugs fixed above: sections
hidden at `opacity: 0` until hydration, and the repository list resizing the page
under them. Both showed up only on deep links, where the affected content is what
you land on.

Two caveats when reading a score:

- **Run it in Incognito, with extensions off.** Lighthouse audits everything that
  runs on the page, extensions included. Measured here: a profile with MetaMask,
  AdBlock, Angular DevTools and React DevTools scored **77** on Best Practices —
  the report blamed `deprecations` on
  `chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/scripts/contentscript.js`
  (MetaMask, using the deprecated Shared Storage API). Every entry under
  `unminified-javascript` and `valid-source-maps` was an extension too. The same
  page in a clean profile scores 100.
- **`errors-in-console` fails while GitHub is rate-limiting.** The browser logs
  the 403 itself and it is not suppressible, so a rate-limited visit scores 96 on
  Best Practices instead of 100.

Lighthouse cannot score `/404.html`: it refuses any page that does not return
200, which is the correct status for that page.

```bash
npx lighthouse http://localhost:8080/ --preset=desktop --view
npx lighthouse http://localhost:8080/ --view
```

Design tokens live at the top of `src/styles.css`.

---

## Deploying

`vercel.json` is set up for the existing Vercel project — `npm run build`, output
at `dist/dtapia-portfolio/browser`, SPA rewrites and cache headers. Vercel builds
with its own Node, so the local version does not matter.

Push to the connected branch, or:

```bash
npx vercel --prod
```

---

## Angular MCP server

`.mcp.json` registers the Angular CLI MCP server for this project, giving an AI
assistant Angular-aware tooling: documentation search, the official best-practices
guide, workspace/project introspection, the OnPush-to-zoneless migration helper,
and control of `ng` targets and the dev server.

```json
{ "command": "npx", "args": ["-y", "@angular/cli@22", "mcp"] }
```

It is picked up when a session starts in this directory. Nothing to install — it
needs only a host Node in Angular 22's supported range, which is why the upgrade
above matters.
