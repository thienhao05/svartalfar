/** The knowledge map: which nodes exist, how they are grouped, where they sit and how they link. */

export interface GraphInput {
  id: string;
  kind: 'entry' | 'project';
  title: string;
  description: string;
  url: string;
  date: Date;
  /** Knowledge area, or project status for a project. */
  label: string;
  lang?: string | undefined;
  categories?: string[];
  tags?: string[];
  related?: string[];
  series?: string | undefined;
  seriesOrder?: number | undefined;
}

export interface GraphNode extends GraphInput {
  nodeId: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** 1-based place in its series, with the series length. */
  step?: { n: number; of: number };
}

export interface GraphGroup {
  key: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: 'feeds' | 'relates';
  /** SVG path: horizontal and vertical runs only, with rounded corners. */
  d: string;
  /** The path was drawn from `to` back to `from`, so the arrowhead goes at its start. */
  reverse: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  groups: GraphGroup[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

export const NODE_W = 208;
/** Tall enough for the badge, two lines of title and the date without squeezing the title. */
export const NODE_H = 96;
const GAP_Y = 16;
const PAD = 16;
const HEAD = 36;
const COL_GAP = 88;
const MARGIN = 48;

/** Left to right, roughly the order one would learn them in; unknown topics follow alphabetically. */
const ORDER = ['Learning methods', 'Linux', 'Networking', 'Databases', 'Backend', 'DevOps'];
const STANDALONE = 'Built on their own';

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

function groupOf(i: GraphInput): string {
  return i.kind === 'project' ? STANDALONE : (i.categories?.[0] ?? 'Other');
}

function columnRank(key: string): number {
  if (key === STANDALONE) return Number.MAX_SAFE_INTEGER;
  const i = ORDER.indexOf(key);
  return i === -1 ? ORDER.length : i;
}

/** Series first (each in reading order, earliest series first), then the loose entries newest first. */
function arrange(items: GraphInput[]): GraphInput[] {
  const series = new Map<string, GraphInput[]>();
  const loose: GraphInput[] = [];
  for (const i of items) {
    if (i.series) series.set(i.series, [...(series.get(i.series) ?? []), i]);
    else loose.push(i);
  }
  const chains = [...series.values()]
    .map((list) =>
      [...list].sort(
        (a, b) =>
          (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER) ||
          a.date.valueOf() - b.date.valueOf(),
      ),
    )
    .sort((a, b) => (a[0]?.date.valueOf() ?? 0) - (b[0]?.date.valueOf() ?? 0));
  loose.sort((a, b) => b.date.valueOf() - a.date.valueOf());
  return [...chains.flat(), ...loose];
}

export function buildGraph(inputs: GraphInput[]): Graph {
  const byGroup = new Map<string, GraphInput[]>();
  for (const i of inputs) byGroup.set(groupOf(i), [...(byGroup.get(groupOf(i)) ?? []), i]);

  const keys = [...byGroup.keys()].sort(
    (a, b) => columnRank(a) - columnRank(b) || a.localeCompare(b),
  );

  const nodes: GraphNode[] = [];
  const groups: GraphGroup[] = [];
  const colWidth = NODE_W + PAD * 2;

  keys.forEach((key, col) => {
    const ordered = arrange(byGroup.get(key) ?? []);
    const x = MARGIN + col * (colWidth + COL_GAP);
    const seriesSize = new Map<string, number>();
    for (const i of ordered)
      if (i.series) seriesSize.set(i.series, (seriesSize.get(i.series) ?? 0) + 1);
    const seen = new Map<string, number>();

    ordered.forEach((input, row) => {
      const node: GraphNode = {
        ...input,
        nodeId: `${input.kind === 'project' ? 'p' : 'k'}:${input.id}`,
        group: key,
        x: x + PAD,
        y: MARGIN + HEAD + PAD + row * (NODE_H + GAP_Y),
        w: NODE_W,
        h: NODE_H,
      };
      if (input.series) {
        const n = (seen.get(input.series) ?? 0) + 1;
        seen.set(input.series, n);
        node.step = { n, of: seriesSize.get(input.series) ?? n };
      }
      nodes.push(node);
    });

    groups.push({
      key,
      label: key,
      x,
      y: MARGIN,
      w: colWidth,
      h: HEAD + PAD * 2 + ordered.length * NODE_H + Math.max(0, ordered.length - 1) * GAP_Y,
      count: ordered.length,
    });
  });

  // Edges: a series reads as a chain; `related` adds links across topics.
  type Raw = { a: GraphNode; b: GraphNode; kind: 'feeds' | 'relates' };
  const raw: Raw[] = [];
  const taken = new Set<string>();
  const bySource = new Map(nodes.filter((n) => n.kind === 'entry').map((n) => [n.id, n]));

  const chains = new Map<string, GraphNode[]>();
  for (const n of nodes) if (n.series) chains.set(n.series, [...(chains.get(n.series) ?? []), n]);
  for (const chain of chains.values()) {
    for (let i = 0; i + 1 < chain.length; i++) {
      const a = chain[i]!;
      const b = chain[i + 1]!;
      raw.push({ a, b, kind: 'feeds' });
      taken.add(pairKey(a.nodeId, b.nodeId));
    }
  }

  const colOf = new Map(keys.map((k, i) => [k, i]));
  const col = (n: GraphNode) => colOf.get(n.group) ?? 0;
  for (const n of nodes) {
    for (const id of n.related ?? []) {
      const other = bySource.get(id);
      if (!other || other.nodeId === n.nodeId) continue;
      const key = pairKey(n.nodeId, other.nodeId);
      if (taken.has(key)) continue;
      taken.add(key);
      const [a, b] = orient(n, other, colOf);
      raw.push({ a, b, kind: 'relates' });
    }
  }

  // Links that jump over a column travel in their own lane above the diagram, so they never cross
  // a card. Make room for the lanes by moving everything down.
  const far = raw.filter((r) => Math.abs(col(r.a) - col(r.b)) >= 2);
  const shift = far.length * LANE;
  if (shift) {
    for (const n of nodes) n.y += shift;
    for (const g of groups) g.y += shift;
  }

  const right = groups.length ? Math.max(...groups.map((g) => g.x + g.w)) : MARGIN;
  const bottom = groups.length ? Math.max(...groups.map((g) => g.y + g.h)) : MARGIN;

  const ctx: RouteContext = { groups, col };
  const lane = new Map(far.map((r, i) => [r, i]));
  const channels = countChannels(raw, ctx);
  const edges: GraphEdge[] = raw.map((r) => {
    const { d, reverse } = route(r.a, r.b, r.kind, ctx, channels, lane.get(r) ?? 0);
    return { from: r.a.nodeId, to: r.b.nodeId, kind: r.kind, d, reverse };
  });

  return { nodes, groups, edges, width: right + MARGIN, height: bottom + MARGIN };
}

/** Links read left to right, and top to bottom inside one column. */
function orient(a: GraphNode, b: GraphNode, col: Map<string, number>): [GraphNode, GraphNode] {
  const ca = col.get(a.group) ?? 0;
  const cb = col.get(b.group) ?? 0;
  if (ca !== cb) return ca < cb ? [a, b] : [b, a];
  return a.y <= b.y ? [a, b] : [b, a];
}

const LANE = 8; // spacing of parallel runs and of the lanes above the diagram
const LANE_TOP = 24; // y of the first lane
const CORNER = 8;

interface RouteContext {
  groups: GraphGroup[];
  col: (n: GraphNode) => number;
}

type Pt = [number, number];

/**
 * A polyline with rounded corners. Each interior corner becomes a small quadratic curve, never
 * larger than half of the shorter run beside it, so short runs stay straight.
 */
export function roundedPolyline(points: Pt[], radius = CORNER): string {
  const first = points[0];
  if (!first) return '';
  let d = `M ${first[0]} ${first[1]}`;
  for (let i = 1; i < points.length; i++) {
    const cur = points[i]!;
    const prev = points[i - 1]!;
    const next = points[i + 1];
    if (!next) {
      d += ` L ${cur[0]} ${cur[1]}`;
      continue;
    }
    const inLen = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    const outLen = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const ux = Math.sign(cur[0] - prev[0]);
    const uy = Math.sign(cur[1] - prev[1]);
    const vx = Math.sign(next[0] - cur[0]);
    const vy = Math.sign(next[1] - cur[1]);
    d += ` L ${cur[0] - ux * r} ${cur[1] - uy * r} Q ${cur[0]} ${cur[1]} ${cur[0] + vx * r} ${cur[1] + vy * r}`;
  }
  return d;
}

/** Which vertical channel each link uses, so parallel links are spaced apart instead of stacked. */
function channelsOf(
  a: GraphNode,
  b: GraphNode,
  ctx: RouteContext,
): { out: string; into: string; kind: 'same' | 'next' | 'far' } {
  const ca = ctx.col(a);
  const cb = ctx.col(b);
  if (ca === cb) return { out: `bow${ca}`, into: `bow${ca}`, kind: 'same' };
  if (cb === ca + 1) return { out: `gap${ca}`, into: `gap${ca}`, kind: 'next' };
  return { out: `gap${ca}`, into: `gap${cb - 1}`, kind: 'far' };
}

type Channels = Map<string, { count: number; next: number }>;

function countChannels(
  raw: { a: GraphNode; b: GraphNode; kind: string }[],
  ctx: RouteContext,
): Channels {
  const m: Channels = new Map();
  const bump = (k: string) => m.set(k, { count: (m.get(k)?.count ?? 0) + 1, next: 0 });
  for (const r of raw) {
    const c = channelsOf(r.a, r.b, ctx);
    if (c.kind === 'same' && isStraight(r.a, r.b)) continue;
    bump(c.out);
    if (c.kind === 'far') bump(c.into);
  }
  return m;
}

const isStraight = (a: GraphNode, b: GraphNode) => Math.abs(b.y - a.y - (a.h + GAP_Y)) < 1;

/** x of the next free run inside a channel, centred on the channel with `LANE` between runs. */
function slot(channels: Channels, key: string, centre: number): number {
  const c = channels.get(key);
  if (!c) return centre;
  const offset = (c.next - (c.count - 1) / 2) * LANE;
  c.next += 1;
  return centre + offset;
}

function route(
  a0: GraphNode,
  b0: GraphNode,
  kind: 'feeds' | 'relates',
  ctx: RouteContext,
  channels: Channels,
  lane: number,
): { d: string; reverse: boolean } {
  // Draw left to right (or top to bottom); remember if that is against the link's own direction.
  const flip = ctx.col(a0) > ctx.col(b0);
  const [a, b] = flip ? [b0, a0] : [a0, b0];
  const reverse = flip && kind === 'feeds';
  const ay = a.y + a.h / 2;
  const by = b.y + b.h / 2;
  const c = channelsOf(a, b, ctx);
  const gapCentre = (colIndex: number) => {
    const g = ctx.groups[colIndex];
    return g ? g.x + g.w + COL_GAP / 2 : 0;
  };

  if (c.kind === 'same') {
    if (isStraight(a, b)) {
      const x = a.x + a.w / 2;
      return { d: `M ${x} ${a.y + a.h} L ${x} ${b.y}`, reverse };
    }
    const g = ctx.groups[ctx.col(a)];
    const x = slot(channels, c.out, (g ? g.x + g.w : a.x + a.w) + COL_GAP / 4);
    return {
      d: roundedPolyline([
        [a.x + a.w, ay],
        [x, ay],
        [x, by],
        [b.x + b.w, by],
      ]),
      reverse,
    };
  }

  if (c.kind === 'next') {
    const x = slot(channels, c.out, gapCentre(ctx.col(a)));
    return {
      d: roundedPolyline([
        [a.x + a.w, ay],
        [x, ay],
        [x, by],
        [b.x, by],
      ]),
      reverse,
    };
  }

  const x1 = slot(channels, c.out, gapCentre(ctx.col(a)));
  const x2 = slot(channels, c.into, gapCentre(ctx.col(b) - 1));
  const y = LANE_TOP + lane * LANE;
  return {
    d: roundedPolyline([
      [a.x + a.w, ay],
      [x1, ay],
      [x1, y],
      [x2, y],
      [x2, by],
      [b.x, by],
    ]),
    reverse,
  };
}
