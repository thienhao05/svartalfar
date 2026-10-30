import { describe, expect, it } from 'vitest';
import { repoLabel } from './repo';

describe('repoLabel', () => {
  it('shows owner/name for a repository URL', () => {
    expect(repoLabel('https://github.com/thienhao05/svartalfar')).toBe('thienhao05/svartalfar');
    expect(repoLabel('https://github.com/a/b.git')).toBe('a/b');
    expect(repoLabel('https://github.com/a/b/tree/main')).toBe('a/b');
  });

  it('falls back to the owner, the host or a plain word', () => {
    expect(repoLabel('https://github.com/thienhao05')).toBe('thienhao05');
    expect(repoLabel('https://example.com/')).toBe('example.com');
    expect(repoLabel('not a url')).toBe('Repository');
  });
});
