import { describe, expect, it } from 'vitest';
import { excerpt, fold, highlight, searchDocs, stripMarkdown, type SearchDoc } from './search';

const doc = (over: Partial<SearchDoc>): SearchDoc => ({
  url: '/x/',
  title: 'Untitled',
  description: '',
  tags: [],
  categories: [],
  lang: 'en',
  text: '',
  ...over,
});

describe('fold', () => {
  it('drops Vietnamese diacritics and keeps the length', () => {
    expect(fold('Các lệnh Đẹp')).toBe('cac lenh dep');
    expect(fold('Các lệnh Đẹp')).toHaveLength('Các lệnh Đẹp'.length);
  });
});

describe('searchDocs', () => {
  const docs = [
    doc({ url: '/a/', title: 'Docker builds', tags: ['docker'], text: 'multi stage' }),
    doc({ url: '/b/', title: 'Các lệnh Linux', text: 'grep and find' }),
    doc({ url: '/c/', title: 'Sleep', description: 'docker is mentioned here' }),
  ];

  it('matches without accents and ranks title over description', () => {
    expect(searchDocs(docs, 'lenh').map((d) => d.url)).toEqual(['/b/']);
    expect(searchDocs(docs, 'docker').map((d) => d.url)).toEqual(['/a/', '/c/']);
  });

  it('needs every term and ignores an empty query', () => {
    expect(searchDocs(docs, 'docker multi').map((d) => d.url)).toEqual(['/a/']);
    expect(searchDocs(docs, 'docker zzz')).toEqual([]);
    expect(searchDocs(docs, '   ')).toEqual([]);
  });
});

describe('excerpt and highlight', () => {
  it('shows text around the match, else the description', () => {
    const d = doc({
      description: 'fallback',
      text: 'a'.repeat(100) + ' needle ' + 'b'.repeat(100),
    });
    expect(excerpt(d, 'needle')).toContain('needle');
    expect(excerpt(d, 'missing')).toBe('fallback');
  });

  it('marks matches ignoring accents', () => {
    expect(highlight('Các lệnh Linux', 'lenh')).toEqual([
      { text: 'Các ', hit: false },
      { text: 'lệnh', hit: true },
      { text: ' Linux', hit: false },
    ]);
  });
});

describe('stripMarkdown', () => {
  it('removes fences and markers', () => {
    expect(stripMarkdown('## Title\n```bash\nls -l\n```\n| a | b |')).toBe('Title ls -l a b');
  });
});
