export interface HeatDay {
  /** YYYY-MM-DD in UTC. */
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
}

export interface Heatmap {
  days: HeatDay[];
  weeks: number;
  total: number;
  activeDays: number;
  /** Consecutive active days up to today (a quiet today does not break yesterday's run). */
  streak: number;
}

const DAY = 86_400_000;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Writing activity for the last `weeks` weeks, Monday-first columns ending with the week of `today`.
 * A day counts every entry published or updated on it.
 */
export function buildHeatmap(dates: Date[], weeks: number, today: Date): Heatmap {
  const counts = new Map<string, number>();
  for (const d of dates) counts.set(isoDay(d), (counts.get(isoDay(d)) ?? 0) + 1);

  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const weekday = (new Date(end).getUTCDay() + 6) % 7; // Monday = 0
  const start = end - (weekday + (weeks - 1) * 7) * DAY;

  const days: HeatDay[] = [];
  for (let t = start; days.length < weeks * 7; t += DAY) {
    const date = isoDay(new Date(t));
    const count = counts.get(date) ?? 0;
    const level = (count === 0 ? 0 : Math.min(4, count)) as HeatDay['level'];
    days.push({ date, count, level, future: t > end });
  }

  const inRange = days.filter((d) => !d.future);
  let streak = 0;
  for (let i = inRange.length - 1; i >= 0; i--) {
    const day = inRange[i]!;
    if (day.count > 0) streak++;
    else if (i !== inRange.length - 1) break;
  }
  return {
    days,
    weeks,
    total: inRange.reduce((sum, d) => sum + d.count, 0),
    activeDays: inRange.filter((d) => d.count > 0).length,
    streak,
  };
}
