import { describe, expect, it } from 'vitest';
import { nextNavState, type NavState } from './scroll';

const at = (hidden: boolean, last: number): NavState => ({ hidden, last });

describe('nextNavState', () => {
  it('stays visible near the top, even after being hidden', () => {
    expect(nextNavState(at(true, 400), 10)).toEqual(at(false, 10));
    expect(nextNavState(at(false, 0), 0)).toEqual(at(false, 0));
  });

  it('does not hide on a small nudge down', () => {
    expect(nextNavState(at(false, 100), 130)).toEqual(at(false, 100));
  });

  it('hides after a deliberate scroll down', () => {
    expect(nextNavState(at(false, 100), 160)).toEqual(at(true, 160));
  });

  it('measures the hide distance from where the scroll began, not the last frame', () => {
    let s = at(false, 100);
    for (const y of [110, 125, 140, 155]) s = nextNavState(s, y);
    expect(s.hidden).toBe(true);
  });

  it('stays hidden through a tiny upward wobble, then returns on a real scroll up', () => {
    const hidden = at(true, 500);
    expect(nextNavState(hidden, 492)).toEqual(at(true, 500));
    expect(nextNavState(hidden, 480)).toEqual(at(false, 480));
  });

  it('restarts the hide distance after the bar was shown again', () => {
    const shown = nextNavState(at(true, 500), 470);
    expect(shown).toEqual(at(false, 470));
    expect(nextNavState(shown, 500).hidden).toBe(false);
    expect(nextNavState(shown, 530).hidden).toBe(true);
  });

  it('treats overscroll above zero as the top', () => {
    expect(nextNavState(at(true, 50), -40)).toEqual(at(false, 0));
  });
});
