export type PageSlice<T> = {
  items: T[];
  page: number;
  totalPages: number;
  offset: number;
};

/** 1-based page slice; an out-of-range page returns an empty slice. */
export function paginate<T>(items: T[], page: number, perPage: number): PageSlice<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const offset = (page - 1) * perPage;
  return { items: items.slice(offset, offset + perPage), page, totalPages, offset };
}

/** Href of a knowledge list page: page 1 is the index itself. */
export function pageHref(page: number): string {
  return page <= 1 ? '/knowledge/' : `/knowledge/page/${page}/`;
}

export type PageItem = number | 'gap';

/**
 * Page numbers to show: everything when short, otherwise the first and last page, the current
 * page and its neighbours, with 'gap' standing in for skipped runs.
 */
export function pageWindow(page: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const sorted = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const items: PageItem[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && n - prev > 1) items.push('gap');
    items.push(n);
  });
  return items;
}
