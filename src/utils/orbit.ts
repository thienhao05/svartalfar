export interface Point {
  x: number;
  y: number;
}

/** Where a tag sits on an ellipse, `theta` plus the ring's current `turn`, both in radians. */
export function orbitPoint(theta: number, turn: number, rx: number, ry: number): Point {
  const a = theta + turn;
  return { x: Math.cos(a) * rx, y: Math.sin(a) * ry };
}

/**
 * Move `speed` toward `target` with an exponential ease that does not depend on the frame rate:
 * the same wall-clock time gives the same result at 30, 60 or 144 frames per second.
 */
export function easeToward(speed: number, target: number, dt: number, rate = 5): number {
  return speed + (target - speed) * (1 - Math.exp(-dt * rate));
}
