const OKLCH = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/i;

const encode = (c: number) => {
  const v = Math.min(1, Math.max(0, c));
  return Math.round((v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055) * 255);
};

/**
 * Convert `oklch(L% C H)` to `rgb(r, g, b)`. Libraries such as Mermaid cannot parse oklch(),
 * and reading pixels back from a canvas is unreliable in browsers that randomise canvas data.
 * Anything that is not an oklch() value is returned unchanged.
 */
export function oklchToRgb(value: string): string {
  const m = OKLCH.exec(value.trim());
  if (!m) return value;
  const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
  const C = Number(m[3]);
  const h = (Number(m[4]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s;
  return `rgb(${encode(r)}, ${encode(g)}, ${encode(bl)})`;
}
