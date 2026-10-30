const EXTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

/** Prefix an internal path with the deploy base (`/` or `/<repo>/`); external links pass through. */
export function withBase(href: string, base: string = import.meta.env.BASE_URL): string {
  if (EXTERNAL.test(href)) return href;
  const root = base.endsWith('/') ? base : `${base}/`;
  return `${root}${href.replace(/^\/+/, '')}`;
}

/** True when `pathname` is `href` or a page below it (Home only matches itself). */
export function isActivePath(pathname: string, href: string, base?: string): boolean {
  const target = withBase(href, base);
  const root = withBase('/', base);
  return target === root ? pathname === root : pathname.startsWith(target);
}
