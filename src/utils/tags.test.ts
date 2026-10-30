import { describe, expect, it } from 'vitest';
import { TAG_COLOURS, tagColour } from './tags';

describe('tagColour', () => {
  it('is stable and case-insensitive', () => {
    expect(tagColour('Linux')).toBe(tagColour('linux'));
    expect(tagColour('shell')).toBe(tagColour('shell'));
  });

  it('stays inside the palette and spreads across it', () => {
    const names = ['linux', 'shell', 'sample', 'writing', 'docker', 'network', 'git', 'ai', 'bash'];
    const slots = names.map(tagColour);
    for (const s of slots) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThan(TAG_COLOURS);
    }
    expect(new Set(slots).size).toBeGreaterThanOrEqual(4);
  });
});
