import { describe, expect, it } from 'vitest';
import { buildToc } from './toc';

const h = (depth: number, slug: string) => ({ depth, slug, text: slug });

describe('buildToc', () => {
  it('nests h3 under the preceding h2 and drops other depths', () => {
    const toc = buildToc([h(1, 't'), h(2, 'a'), h(3, 'a1'), h(4, 'x'), h(2, 'b')]);
    expect(toc.map((i) => i.slug)).toEqual(['a', 'b']);
    expect(toc[0]?.children.map((i) => i.slug)).toEqual(['a1']);
  });

  it('keeps a leading h3 at the top level', () => {
    expect(buildToc([h(3, 'lead')]).map((i) => i.slug)).toEqual(['lead']);
  });
});
