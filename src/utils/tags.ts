export const TAG_COLOURS = 6;

/** Stable colour slot (0 to 5) for a hashtag, so a tag keeps its colour on every page. */
export function tagColour(name: string): number {
  // FNV-1a, then a final mix so near-identical names still land in different slots.
  let h = 2166136261;
  for (const ch of name.toLowerCase()) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return (h >>> 0) % TAG_COLOURS;
}
