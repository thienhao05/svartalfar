import GithubSlugger from 'github-slugger';

/** The shape these helpers need; a `CollectionEntry<'knowledge'>` satisfies it. */
export interface EntryLike {
  id: string;
  data: {
    title: string;
    date: Date;
    updated?: Date | undefined;
    draft: boolean;
    categories: string[];
    tags: string[];
    related: string[];
    series?: string | undefined;
    seriesOrder?: number | undefined;
  };
}

/** Drafts are visible in `astro dev` and never in a production build. */
export function isPublished(entry: EntryLike, isProd: boolean = import.meta.env.PROD): boolean {
  return !isProd || !entry.data.draft;
}

export function lastTouched(entry: EntryLike): Date {
  return entry.data.updated ?? entry.data.date;
}

export function byDateDesc<T extends EntryLike>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Entries whose `updated` is set and later than their `date`, most recent first. */
export function recentlyUpdated<T extends EntryLike>(entries: T[], limit: number): T[] {
  return entries
    .filter((e) => e.data.updated && e.data.updated > e.data.date)
    .sort((a, b) => lastTouched(b).valueOf() - lastTouched(a).valueOf())
    .slice(0, limit);
}

export function slugify(name: string): string {
  return new GithubSlugger().slug(name);
}

export interface Group {
  name: string;
  slug: string;
  count: number;
}

/** Categories or tags with entry counts, most used first, then alphabetical. */
export function groupCounts(entries: EntryLike[], key: 'categories' | 'tags'): Group[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const name of entry.data[key]) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Hand-picked `related` ids first (in the author's order), then entries sharing the most
 * tags or categories, newest first. Never the entry itself.
 */
export function relatedEntries<T extends EntryLike>(entry: T, all: T[], limit = 3): T[] {
  const others = all.filter((e) => e.id !== entry.id);
  const picked = entry.data.related
    .map((id) => others.find((e) => e.id === id))
    .filter((e): e is T => Boolean(e));

  const shared = (e: T) =>
    e.data.tags.filter((t) => entry.data.tags.includes(t)).length +
    e.data.categories.filter((c) => entry.data.categories.includes(c)).length;

  const scored = byDateDesc(others.filter((e) => !picked.includes(e)))
    .map((e) => ({ e, score: shared(e) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ e }) => e);

  return [...picked, ...scored].slice(0, limit);
}

/** Older and newer neighbours in date order. */
export function neighbours<T extends EntryLike>(entry: T, all: T[]): { older?: T; newer?: T } {
  const sorted = byDateDesc(all);
  const i = sorted.findIndex((e) => e.id === entry.id);
  if (i === -1) return {};
  const result: { older?: T; newer?: T } = {};
  const older = sorted[i + 1];
  const newer = sorted[i - 1];
  if (older) result.older = older;
  if (newer) result.newer = newer;
  return result;
}

export function countWords(text: string): number {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

/** Rough reading time: 220 words per minute, at least one. */
export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(countWords(text) / 220));
}

export interface SeriesGroup<T> {
  name: string;
  slug: string;
  entries: T[];
}

/** Entries grouped by series, each series in reading order (seriesOrder, then oldest first). */
export function groupSeries<T extends EntryLike>(entries: T[]): SeriesGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const e of entries) {
    const name = e.data.series;
    if (name) map.set(name, [...(map.get(name) ?? []), e]);
  }
  return [...map]
    .map(([name, list]) => ({
      name,
      slug: slugify(name),
      entries: list.sort(
        (a, b) =>
          (a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) ||
          a.data.date.valueOf() - b.data.date.valueOf(),
      ),
    }))
    .sort((a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name));
}

export interface YearGroup<T> {
  year: number;
  entries: T[];
}

/** Entries grouped by publish year, newest year first and newest entry first within it. */
export function groupByYear<T extends EntryLike>(entries: T[]): YearGroup<T>[] {
  const map = new Map<number, T[]>();
  for (const e of byDateDesc(entries)) {
    const year = e.data.date.getUTCFullYear();
    map.set(year, [...(map.get(year) ?? []), e]);
  }
  return [...map].map(([year, list]) => ({ year, entries: list })).sort((a, b) => b.year - a.year);
}

/** 0 to 1: how heavy a tag with `count` uses is, between the least and most used. */
export function cloudWeight(count: number, min: number, max: number): number {
  if (max <= min) return 0.5;
  return (count - min) / (max - min);
}
