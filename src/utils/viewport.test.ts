import { describe, expect, it } from 'vitest';
import {
  MAX_K,
  MIN_K,
  centreOn,
  fitTransform,
  panBy,
  revealRect,
  visibleRect,
  zoomAt,
} from './viewport';

describe('zoomAt', () => {
  it('keeps the point under the cursor fixed', () => {
    const t = { x: 40, y: 20, k: 1 };
    const z = zoomAt(t, 2, 300, 200);
    // world point under (300,200) before and after
    expect((300 - t.x) / t.k).toBeCloseTo((300 - z.x) / z.k, 9);
    expect((200 - t.y) / t.k).toBeCloseTo((200 - z.y) / z.k, 9);
    expect(z.k).toBe(2);
  });

  it('stays within the zoom limits', () => {
    expect(zoomAt({ x: 0, y: 0, k: 2 }, 10, 0, 0).k).toBe(MAX_K);
    expect(zoomAt({ x: 0, y: 0, k: 0.3 }, 0.01, 0, 0).k).toBe(MIN_K);
  });
});

describe('fitTransform', () => {
  it('shrinks a large world to fit and centres it', () => {
    // Width decides: (1000 - 2 * 50) / 2000 = 0.45, which is smaller than the height ratio.
    const t = fitTransform({ w: 2000, h: 1000 }, { w: 1000, h: 800 }, 50);
    expect(t.k).toBeCloseTo(0.45, 9);
    expect(t.x).toBeCloseTo((1000 - 2000 * 0.45) / 2, 9);
    expect(t.y).toBeCloseTo((800 - 1000 * 0.45) / 2, 9);
  });

  it('never enlarges past the cap, and survives an empty view', () => {
    expect(fitTransform({ w: 100, h: 100 }, { w: 1000, h: 1000 }).k).toBe(1);
    expect(fitTransform({ w: 100, h: 100 }, { w: 0, h: 0 })).toEqual({ x: 0, y: 0, k: 1 });
  });
});

describe('visibleRect and centreOn', () => {
  it('maps the screen back to the world', () => {
    const t = { x: -100, y: -50, k: 2 };
    expect(visibleRect(t, { w: 400, h: 200 })).toEqual({ x: 50, y: 25, w: 200, h: 100 });
  });

  it('centres a world point on screen', () => {
    const t = centreOn({ x: 0, y: 0, k: 2 }, { w: 800, h: 600 }, 500, 300);
    expect(500 * 2 + t.x).toBe(400);
    expect(300 * 2 + t.y).toBe(300);
  });
});

describe('revealRect', () => {
  const view = { w: 800, h: 600 };

  it('does nothing when the rectangle is already visible', () => {
    const t = { x: 0, y: 0, k: 1 };
    expect(revealRect(t, view, { x: 100, y: 100, w: 100, h: 50 })).toBe(t);
  });

  it('pans just enough to bring an off-screen rectangle into view', () => {
    const t = revealRect({ x: 0, y: 0, k: 1 }, view, { x: 900, y: 100, w: 100, h: 50 }, 20);
    expect(900 + 100 + t.x).toBe(780);
  });

  it('panBy moves the view', () => {
    expect(panBy({ x: 1, y: 2, k: 1 }, 5, -3)).toEqual({ x: 6, y: -1, k: 1 });
  });
});
