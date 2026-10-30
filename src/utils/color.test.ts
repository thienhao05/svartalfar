import { describe, expect, it } from 'vitest';
import { oklchToRgb } from './color';

describe('oklchToRgb', () => {
  it('maps the achromatic extremes', () => {
    expect(oklchToRgb('oklch(100% 0 0)')).toBe('rgb(255, 255, 255)');
    expect(oklchToRgb('oklch(0% 0 0)')).toBe('rgb(0, 0, 0)');
  });

  it('accepts fractional lightness and a tinted colour', () => {
    expect(oklchToRgb('oklch(1 0 0)')).toBe('rgb(255, 255, 255)');
    const [r, g, b] = oklchToRgb('oklch(80% 0.125 82)').match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(g!);
    expect(g).toBeGreaterThan(b!);
  });

  it('leaves other colour formats alone', () => {
    expect(oklchToRgb('#fff')).toBe('#fff');
    expect(oklchToRgb('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
  });
});
