import { describe, expect, it } from 'vitest';
import { buildHeatmap } from './heatmap';

describe('buildHeatmap', () => {
  // 2026-10-30 is a Friday.
  const today = new Date('2026-10-30T15:00:00Z');

  it('starts on a Monday and fills whole weeks', () => {
    const map = buildHeatmap([], 4, today);
    expect(map.days).toHaveLength(28);
    expect(map.days[0]?.date).toBe('2026-10-05');
    expect(new Date(map.days[0]!.date).getUTCDay()).toBe(1);
  });

  it('marks days after today as future and leaves them out of totals', () => {
    const map = buildHeatmap([new Date('2026-10-31'), new Date('2026-10-30')], 1, today);
    expect(map.days.filter((d) => d.future).map((d) => d.date)).toEqual([
      '2026-10-31',
      '2026-11-01',
    ]);
    expect(map.total).toBe(1);
  });

  it('caps the level at 4', () => {
    const many = Array.from({ length: 6 }, () => new Date('2026-10-29'));
    const map = buildHeatmap(many, 1, today);
    expect(map.days.find((d) => d.date === '2026-10-29')).toMatchObject({ count: 6, level: 4 });
    expect(map.activeDays).toBe(1);
  });

  it('counts the current streak, forgiving a quiet today', () => {
    const run = ['2026-10-27', '2026-10-28', '2026-10-29'].map((d) => new Date(d));
    expect(buildHeatmap(run, 2, today).streak).toBe(3);
    expect(buildHeatmap([...run, new Date('2026-10-30')], 2, today).streak).toBe(4);
    expect(buildHeatmap([new Date('2026-10-20')], 2, today).streak).toBe(0);
  });
});
