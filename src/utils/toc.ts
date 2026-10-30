export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface TocItem extends Heading {
  children: TocItem[];
}

/** Nest h2/h3 headings into a two-level tree; deeper headings and h1 are left out. */
export function buildToc(headings: Heading[]): TocItem[] {
  const tree: TocItem[] = [];
  for (const h of headings) {
    if (h.depth === 2) tree.push({ ...h, children: [] });
    else if (h.depth === 3) {
      const parent = tree.at(-1);
      if (parent) parent.children.push({ ...h, children: [] });
      else tree.push({ ...h, children: [] });
    }
  }
  return tree;
}
