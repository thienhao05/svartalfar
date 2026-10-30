import { describe, expect, it } from 'vitest';
import { NODE_H, buildGraph, roundedPolyline, type GraphInput } from './graph';

const input = (id: string, over: Partial<GraphInput> = {}): GraphInput => ({
  id,
  kind: 'entry',
  title: id,
  description: '',
  url: `/${id}/`,
  date: new Date('2026-01-01'),
  label: 'learning',
  categories: ['Linux'],
  ...over,
});

describe('buildGraph', () => {
  it('puts topics in learning order with standalone projects last', () => {
    const g = buildGraph([
      input('p1', { kind: 'project', categories: [] }),
      input('d', { categories: ['DevOps'] }),
      input('l', { categories: ['Linux'] }),
      input('m', { categories: ['Learning methods'] }),
      input('z', { categories: ['Zeta'] }),
    ]);
    expect(g.groups.map((x) => x.label)).toEqual([
      'Learning methods',
      'Linux',
      'DevOps',
      'Zeta',
      'Built on their own',
    ]);
    expect(g.groups.map((x) => x.x)).toEqual([...g.groups.map((x) => x.x)].sort((a, b) => a - b));
  });

  it('stacks series in reading order first, then loose entries newest first', () => {
    const g = buildGraph([
      input('loose-old', { date: new Date('2026-01-01') }),
      input('s2', { series: 'S', seriesOrder: 2, date: new Date('2026-03-01') }),
      input('loose-new', { date: new Date('2026-05-01') }),
      input('s1', { series: 'S', seriesOrder: 1, date: new Date('2026-04-01') }),
    ]);
    expect(g.nodes.map((n) => n.id)).toEqual(['s1', 's2', 'loose-new', 'loose-old']);
    expect(g.nodes[0]?.step).toEqual({ n: 1, of: 2 });
    expect(g.nodes[2]?.step).toBeUndefined();
  });

  it('chains a series with feed edges and adds each related pair once', () => {
    const g = buildGraph([
      input('a', { series: 'S', seriesOrder: 1, related: ['b', 'x'] }),
      input('b', { series: 'S', seriesOrder: 2, related: ['a'] }),
      input('x', { categories: ['Networking'], related: ['a', 'missing'] }),
    ]);
    const kinds = g.edges.map((e) => `${e.kind}:${e.from}>${e.to}`);
    expect(kinds).toEqual(['feeds:k:a>k:b', 'relates:k:a>k:x']);
  });

  it('never gives two nodes the same place and sizes the canvas to contain everything', () => {
    const g = buildGraph([input('a'), input('b'), input('c', { categories: ['Networking'] })]);
    const spots = new Set(g.nodes.map((n) => `${n.x},${n.y}`));
    expect(spots.size).toBe(g.nodes.length);
    for (const n of g.nodes) {
      expect(n.x + n.w).toBeLessThanOrEqual(g.width);
      expect(n.y + n.h).toBeLessThanOrEqual(g.height);
    }
  });

  it('copes with nothing at all', () => {
    const g = buildGraph([]);
    expect(g.nodes).toEqual([]);
    expect(g.width).toBeGreaterThan(0);
  });
});

describe('roundedPolyline', () => {
  it('turns every interior corner into a short curve and keeps the ends', () => {
    const d = roundedPolyline(
      [
        [0, 0],
        [100, 0],
        [100, 100],
      ],
      8,
    );
    expect(d.startsWith('M 0 0')).toBe(true);
    expect(d.endsWith('L 100 100')).toBe(true);
    expect(d.match(/Q/g)).toHaveLength(1);
    expect(d).toContain('Q 100 0 100 8');
  });

  it('shrinks the curve on a short run so it never overshoots', () => {
    expect(
      roundedPolyline(
        [
          [0, 0],
          [100, 0],
          [100, 6],
        ],
        8,
      ),
    ).toContain('Q 100 0 100 3');
  });

  it('handles nothing and a single point', () => {
    expect(roundedPolyline([])).toBe('');
    expect(roundedPolyline([[3, 4]])).toBe('M 3 4');
  });
});

describe('edge routing', () => {
  const g = buildGraph([
    input('a', { series: 'S', seriesOrder: 1, related: ['n1', 'n3'] }),
    input('b', { series: 'S', seriesOrder: 2 }),
    input('n1', { categories: ['Networking'] }),
    input('d1', { categories: ['Databases'] }),
    input('n3', { categories: ['Backend'] }),
  ]);
  const edge = (from: string, to: string) =>
    g.edges.find((e) => e.from === `k:${from}` && e.to === `k:${to}`)!;
  const top = Math.min(...g.groups.map((x) => x.y));

  it('joins neighbours in a column with a short vertical line', () => {
    const a = g.nodes.find((n) => n.id === 'a')!;
    const b = g.nodes.find((n) => n.id === 'b')!;
    expect(edge('a', 'b').d).toBe(`M ${a.x + a.w / 2} ${a.y + NODE_H} L ${a.x + a.w / 2} ${b.y}`);
  });

  it('uses only horizontal and vertical runs, with rounded corners', () => {
    for (const e of g.edges) expect(e.d).not.toMatch(/ C /);
  });

  it('sends a link that skips columns through a lane above every group', () => {
    const far = edge('a', 'n3');
    const nums = (far.d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    expect(Math.min(...nums)).toBeLessThan(top);
  });

  it('keeps a neighbouring-column link inside the gap, below the lane area', () => {
    const near = edge('a', 'n1');
    expect(near.d).not.toContain(`${top - 1}`);
    expect(near.reverse).toBe(false);
  });

  it('makes room for the lanes by moving the diagram down', () => {
    const plain = buildGraph([input('a'), input('n', { categories: ['Networking'] })]);
    expect(top).toBeGreaterThan(Math.min(...plain.groups.map((x) => x.y)));
  });
});
