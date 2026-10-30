import { describe, expect, it } from 'vitest';
import {
  byDateDesc,
  cloudWeight,
  countWords,
  groupByYear,
  groupSeries,
  groupCounts,
  isPublished,
  neighbours,
  readingMinutes,
  recentlyUpdated,
  relatedEntries,
  type EntryLike,
} from './content';

const entry = (id: string, date: string, extra: Partial<EntryLike['data']> = {}): EntryLike => ({
  id,
  data: {
    title: id,
    date: new Date(date),
    draft: false,
    categories: [],
    tags: [],
    related: [],
    ...extra,
  },
});

describe('isPublished', () => {
  it('hides drafts only in production', () => {
    const draft = entry('d', '2026-01-01', { draft: true });
    expect(isPublished(draft, true)).toBe(false);
    expect(isPublished(draft, false)).toBe(true);
  });
});

describe('byDateDesc', () => {
  it('sorts newest first without mutating the input', () => {
    const input = [entry('a', '2026-01-01'), entry('b', '2026-03-01')];
    expect(byDateDesc(input).map((e) => e.id)).toEqual(['b', 'a']);
    expect(input[0]?.id).toBe('a');
  });
});

describe('recentlyUpdated', () => {
  it('keeps entries updated after publishing, ordered by update', () => {
    const list = [
      entry('never', '2026-01-01'),
      entry('old-update', '2026-01-01', { updated: new Date('2026-02-01') }),
      entry('new-update', '2026-01-05', { updated: new Date('2026-04-01') }),
    ];
    expect(recentlyUpdated(list, 5).map((e) => e.id)).toEqual(['new-update', 'old-update']);
  });
});

describe('groupCounts', () => {
  it('counts, slugs and orders by use then name', () => {
    const list = [
      entry('a', '2026-01-01', { tags: ['Linux', 'Shell'] }),
      entry('b', '2026-01-02', { tags: ['Linux'] }),
    ];
    expect(groupCounts(list, 'tags')).toEqual([
      { name: 'Linux', slug: 'linux', count: 2 },
      { name: 'Shell', slug: 'shell', count: 1 },
    ]);
  });
});

describe('relatedEntries', () => {
  const self = entry('self', '2026-01-10', { tags: ['linux', 'net'], related: ['picked'] });
  const all = [
    self,
    entry('picked', '2025-01-01'),
    entry('two-shared', '2026-01-01', { tags: ['linux', 'net'] }),
    entry('one-shared', '2026-01-09', { tags: ['linux'] }),
    entry('none', '2026-01-08'),
  ];

  it('puts hand-picked first, then by overlap, never itself or unrelated', () => {
    expect(relatedEntries(self, all).map((e) => e.id)).toEqual([
      'picked',
      'two-shared',
      'one-shared',
    ]);
  });

  it('ignores related ids that do not exist', () => {
    const lonely = entry('x', '2026-01-01', { related: ['missing'] });
    expect(relatedEntries(lonely, [lonely])).toEqual([]);
  });
});

describe('neighbours', () => {
  it('returns older and newer by date', () => {
    const list = [entry('a', '2026-01-01'), entry('b', '2026-02-01'), entry('c', '2026-03-01')];
    const { older, newer } = neighbours(list[1]!, list);
    expect(older?.id).toBe('a');
    expect(newer?.id).toBe('c');
  });
});

describe('countWords', () => {
  it('counts words including Vietnamese diacritics', () => {
    expect(countWords('Ghi lại hành trình, lưu giữ tri thức.')).toBe(8);
    expect(countWords('')).toBe(0);
  });
});

describe('readingMinutes', () => {
  it('counts Vietnamese words and never returns zero', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('Ghi lại hành trình. '.repeat(220))).toBe(4);
  });
});

describe('groupSeries', () => {
  const list = [
    entry('a2', '2026-02-01', { series: 'Alpha', seriesOrder: 2 }),
    entry('a1', '2026-03-01', { series: 'Alpha', seriesOrder: 1 }),
    entry('b1', '2026-01-01', { series: 'Beta' }),
    entry('b2', '2026-01-05', { series: 'Beta' }),
    entry('none', '2026-01-09'),
  ];

  it('groups by series, in reading order, and skips entries without one', () => {
    const groups = groupSeries(list);
    expect(groups.map((g) => g.name)).toEqual(['Alpha', 'Beta']);
    expect(groups[0]?.entries.map((e) => e.id)).toEqual(['a1', 'a2']);
    expect(groups[1]?.entries.map((e) => e.id)).toEqual(['b1', 'b2']);
    expect(groups[0]?.slug).toBe('alpha');
  });
});

describe('groupByYear', () => {
  it('puts the newest year first and the newest entry first inside it', () => {
    const groups = groupByYear([
      entry('old', '2025-06-01'),
      entry('new', '2026-05-01'),
      entry('mid', '2026-02-01'),
    ]);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0]?.entries.map((e) => e.id)).toEqual(['new', 'mid']);
  });
});

describe('cloudWeight', () => {
  it('scales between the least and most used tag', () => {
    expect(cloudWeight(1, 1, 5)).toBe(0);
    expect(cloudWeight(5, 1, 5)).toBe(1);
    expect(cloudWeight(3, 1, 5)).toBe(0.5);
  });

  it('is neutral when every tag is used equally', () => {
    expect(cloudWeight(2, 2, 2)).toBe(0.5);
  });
});
