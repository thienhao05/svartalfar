import { z } from 'astro/zod';
import { iconNames } from './icons';

/**
 * The single place for personal, user-editable configuration.
 * The rune inscription lives here and nowhere else; render it through <RuneMark />.
 */
const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const siteSchema = z.object({
  rune: z.literal('ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ'),
  slogan: z.string(),
  description: z.string(),
  intro: z.array(z.string()).min(1),
  author: z.object({
    name: z.string(),
    /** Shown as @handle under the name. */
    handle: z.string(),
    role: z.string(),
    /** Path under public/, e.g. /avatar.jpg */
    avatar: z.string().optional(),
    github: z.string().url().optional(),
    email: z.string().email().optional(),
  }),
  nav: z.array(linkSchema),
  /** Short list shown on the home page until Learning Paths exist. */
  currentJourney: z.array(
    z.object({ text: z.string(), status: z.enum(['now', 'next', 'paused']) }),
  ),
  /** Cards in the home page's right column. */
  navigation: z.array(
    z.object({
      icon: z.enum(iconNames),
      title: z.string(),
      subtitle: z.string(),
      href: z.string(),
    }),
  ),
  knowledge: z.object({ perPage: z.number().int().positive() }),
});

export type SiteConfig = z.infer<typeof siteSchema>;

export const site: SiteConfig = siteSchema.parse({
  rune: 'ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ',
  slogan: 'Document the Journey. Preserve the Knowledge.',
  description:
    'A personal knowledge archive: what I learn, what I build and what work teaches me, kept in one place.',
  // TODO(owner): rewrite in your own voice.
  intro: [
    'This is where I keep what I learn while studying and working: notes, experiments, mistakes and the understanding that came after them.',
    'Every entry is written to be read again later, by me or by anyone walking the same path.',
  ],
  author: {
    // TODO(owner): your name, role and links.
    name: 'thienhao05',
    handle: '@thienhao05',
    avatar: '/avatar.jpg',
    // TODO(owner): a motto in your own words.
    role: 'Read the docs. Break the build. Write it down.',
    github: 'https://github.com/thienhao05',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Knowledge', href: '/knowledge/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'View', href: '/view/' },
  ],
  // TODO(owner): what you are actually learning now.
  currentJourney: [
    { text: 'Linux internals and the shell', status: 'now' },
    { text: 'Backend services with TypeScript', status: 'now' },
    { text: 'Networking fundamentals', status: 'next' },
  ],
  navigation: [
    { icon: 'book', title: 'Knowledge', subtitle: 'Every entry kept so far', href: '/knowledge/' },
    { icon: 'code', title: 'Projects', subtitle: 'Builds and experiments', href: '/projects/' },
    {
      icon: 'github',
      title: 'GitHub',
      subtitle: 'Code and experiments',
      href: 'https://github.com/thienhao05',
    },
  ],
  knowledge: { perPage: 8 },
});
