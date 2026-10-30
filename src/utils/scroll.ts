export interface NavState {
  hidden: boolean;
  /**
   * While shown: the lowest scroll position since it was last shown (where scrolling down began).
   * While hidden: the highest position since it was hidden (where scrolling up began).
   */
  last: number;
}

const TOP = 24;
/** Scroll down this far before the bar hides, so a small nudge never makes it jump away. */
const HIDE_AFTER = 48;
/** Scroll back up this far before it returns. */
const SHOW_AFTER = 16;

/**
 * Auto-hide rule for the header: always shown near the top, hidden after a deliberate scroll
 * down, shown again after a short scroll up. Movement under the thresholds changes nothing.
 */
export function nextNavState(state: NavState, y: number): NavState {
  const pos = Math.max(0, y);
  if (pos < TOP) return { hidden: false, last: pos };

  if (!state.hidden) {
    const anchor = Math.min(state.last, pos);
    if (pos - anchor > HIDE_AFTER) return { hidden: true, last: pos };
    return anchor === state.last ? state : { hidden: false, last: anchor };
  }

  const anchor = Math.max(state.last, pos);
  if (anchor - pos > SHOW_AFTER) return { hidden: false, last: pos };
  return anchor === state.last ? state : { hidden: true, last: anchor };
}
