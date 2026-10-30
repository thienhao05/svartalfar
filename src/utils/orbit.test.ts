import { describe, expect, it } from 'vitest';
import { easeToward, orbitPoint } from './orbit';

describe('orbitPoint', () => {
  it('starts on the right of the ellipse and reaches the bottom a quarter turn later', () => {
    expect(orbitPoint(0, 0, 400, 100)).toEqual({ x: 400, y: 0 });
    const q = orbitPoint(0, Math.PI / 2, 400, 100);
    expect(q.x).toBeCloseTo(0, 6);
    expect(q.y).toBeCloseTo(100, 6);
  });

  it('adds the ring turn to the tag angle', () => {
    const a = orbitPoint(Math.PI / 2, 0, 400, 100);
    const b = orbitPoint(0, Math.PI / 2, 400, 100);
    expect(a.x).toBeCloseTo(b.x, 6);
    expect(a.y).toBeCloseTo(b.y, 6);
  });

  it('stays on the ellipse for any angle', () => {
    for (const t of [0.3, 1.7, 3.1, 5.2]) {
      const { x, y } = orbitPoint(t, 0.9, 300, 80);
      expect((x / 300) ** 2 + (y / 80) ** 2).toBeCloseTo(1, 9);
    }
  });
});

describe('easeToward', () => {
  it('moves toward the target without overshooting it', () => {
    let s = 1;
    for (let i = 0; i < 200; i++) {
      s = easeToward(s, 0, 1 / 60);
      expect(s).toBeGreaterThanOrEqual(0);
    }
    expect(s).toBeLessThan(0.001);
  });

  it('gives the same result for the same elapsed time at different frame rates', () => {
    let a = 1;
    for (let i = 0; i < 30; i++) a = easeToward(a, 0, 1 / 30);
    let b = 1;
    for (let i = 0; i < 120; i++) b = easeToward(b, 0, 1 / 120);
    expect(a).toBeCloseTo(b, 9);
  });

  it('does not move when already at the target', () => {
    expect(easeToward(1, 1, 0.016)).toBe(1);
  });
});
