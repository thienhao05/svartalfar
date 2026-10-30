import { describe, expect, it } from 'vitest';
import { isActivePath, withBase } from './url';

describe('withBase', () => {
  it('keeps root-relative paths at a root base', () => {
    expect(withBase('/', '/')).toBe('/');
    expect(withBase('/knowledge/', '/')).toBe('/knowledge/');
  });

  it('prefixes a project base with or without its trailing slash', () => {
    expect(withBase('/knowledge/', '/svartalfar/')).toBe('/svartalfar/knowledge/');
    expect(withBase('knowledge/', '/svartalfar')).toBe('/svartalfar/knowledge/');
    expect(withBase('/', '/svartalfar')).toBe('/svartalfar/');
  });

  it('leaves external, protocol and hash links alone', () => {
    expect(withBase('https://github.com/', '/x/')).toBe('https://github.com/');
    expect(withBase('mailto:a@b.c', '/x/')).toBe('mailto:a@b.c');
    expect(withBase('#top', '/x/')).toBe('#top');
  });
});

describe('isActivePath', () => {
  it('matches Home only on the root', () => {
    expect(isActivePath('/', '/', '/')).toBe(true);
    expect(isActivePath('/knowledge/', '/', '/')).toBe(false);
  });

  it('matches a section and its children', () => {
    expect(isActivePath('/x/knowledge/linux/', '/knowledge/', '/x/')).toBe(true);
    expect(isActivePath('/x/', '/knowledge/', '/x/')).toBe(false);
  });
});
