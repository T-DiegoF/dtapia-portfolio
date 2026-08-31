/** Single source of truth for who this site is about and where to reach him. */
export const PROFILE = {
  name: 'Diego Tapia',
  initials: 'DT',
  company: 'TheLab Technology',
  github: 'https://github.com/T-DiegoF',
  linkedin: 'https://www.linkedin.com/in/diego-federico-tapia-a25986176/',
  siteUrl: 'https://dtapia-dev.vercel.app/',
} as const;

/*
 * The email address is stored reversed and split, so the literal string exists
 * nowhere in the shipped bundle and never lands in the DOM until a visitor
 * clicks to reveal it. Harvesters scrape `mailto:` hrefs and regex the served
 * HTML; neither finds anything here.
 *
 * This stops automated collection, not a determined human reading the source.
 */
const EMAIL_LOCAL_REVERSED = 'd.ociredef.aipat';
const EMAIL_DOMAIN_REVERSED = 'moc.liamg';

const reverse = (value: string): string => [...value].reverse().join('');

/** Assembles the real address. Only ever called in response to a click. */
export function contactEmail(): string {
  return `${reverse(EMAIL_LOCAL_REVERSED)}@${reverse(EMAIL_DOMAIN_REVERSED)}`;
}

/** Same character count as the real address, so revealing it does not reflow. */
export const EMAIL_MASK = '••••••••••••••••@•••••.•••';

/** Grouped tooling shown in the stack section. Labels come from the dictionary. */
export const STACK_GROUPS = [
  {
    key: 'stackBackend',
    items: ['Node.js', 'NestJS', 'Express', 'Python', 'TypeORM', 'PostgreSQL', 'MySQL', 'Redis'],
  },
  {
    key: 'stackFrontend',
    items: ['Angular', 'RxJS', 'Signals', 'TypeScript', 'Next.js', 'React'],
  },
  {
    key: 'stackCloud',
    items: ['AWS', 'Docker', 'CI/CD', 'Datadog', 'Vercel', 'Railway'],
  },
  {
    key: 'stackAI',
    items: ['Claude Code'],
  },
] as const;
