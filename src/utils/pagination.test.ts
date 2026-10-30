import { describe, expect, it } from 'vitest';
import { pageHref, pageWindow, paginate } from './pagination';

describe('paginate', () => {
  const items = Array.from({ length: 10 }, (_, i) => i);

  it('slices pages and reports totals', () => {
    expect(paginate(items, 1, 4)).toEqual({
      items: [0, 1, 2, 3],
      page: 1,
      totalPages: 3,
      offset: 0,
    });
    expect(paginate(items, 3, 4).items).toEqual([8, 9]);
  });

  it('has one page when empty', () => {
    expect(paginate([], 1, 4).totalPages).toBe(1);
  });
});

describe('pageHref', () => {
  it('maps page 1 to the index', () => {
    expect(pageHref(1)).toBe('/knowledge/');
    expect(pageHref(2)).toBe('/knowledge/page/2/');
  });
});

describe('pageWindow', () => {
  it('lists every page when there are few', () => {
    expect(pageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(1, 1)).toEqual([1]);
  });

  it('collapses the middle of a long run', () => {
    expect(pageWindow(1, 12)).toEqual([1, 2, 3, 4, 'gap', 12]);
    expect(pageWindow(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12]);
    expect(pageWindow(12, 12)).toEqual([1, 'gap', 9, 10, 11, 12]);
  });
});
