/** Pan and zoom maths for the map. A transform places the world at (x, y) scaled by k. */

export interface Transform {
  x: number;
  y: number;
  k: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MIN_K = 0.2;
export const MAX_K = 2.5;

export const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k));

/** Zoom by `factor` keeping the screen point (px, py) fixed over the same spot of the world. */
export function zoomAt(t: Transform, factor: number, px: number, py: number): Transform {
  const k = clampK(t.k * factor);
  const r = k / t.k;
  return { k, x: px - (px - t.x) * r, y: py - (py - t.y) * r };
}

export function panBy(t: Transform, dx: number, dy: number): Transform {
  return { ...t, x: t.x + dx, y: t.y + dy };
}

/** The transform that shows the whole world inside the view, centred, with some breathing room. */
export function fitTransform(world: Size, view: Size, pad = 48, maxK = 1): Transform {
  if (world.w <= 0 || world.h <= 0 || view.w <= 0 || view.h <= 0) return { x: 0, y: 0, k: 1 };
  const k = clampK(Math.min(maxK, (view.w - pad * 2) / world.w, (view.h - pad * 2) / world.h));
  return { k, x: (view.w - world.w * k) / 2, y: (view.h - world.h * k) / 2 };
}

/** Centre the view on a world point at the current zoom. */
export function centreOn(t: Transform, view: Size, wx: number, wy: number): Transform {
  return { ...t, x: view.w / 2 - wx * t.k, y: view.h / 2 - wy * t.k };
}

/** The part of the world currently visible, in world coordinates. */
export function visibleRect(t: Transform, view: Size): Rect {
  return { x: -t.x / t.k, y: -t.y / t.k, w: view.w / t.k, h: view.h / t.k };
}

/** Nudge the view the least amount needed to bring a world rectangle fully on screen. */
export function revealRect(t: Transform, view: Size, r: Rect, margin = 32): Transform {
  const left = r.x * t.k + t.x;
  const top = r.y * t.k + t.y;
  const right = left + r.w * t.k;
  const bottom = top + r.h * t.k;
  let dx = 0;
  let dy = 0;
  if (left < margin) dx = margin - left;
  else if (right > view.w - margin) dx = view.w - margin - right;
  if (top < margin) dy = margin - top;
  else if (bottom > view.h - margin) dy = view.h - margin - bottom;
  return dx || dy ? panBy(t, dx, dy) : t;
}
