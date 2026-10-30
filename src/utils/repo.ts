/** "owner/name" for a repository URL such as https://github.com/owner/name, else the host. */
export function repoLabel(url: string): string {
  try {
    const u = new URL(url);
    const [owner, name] = u.pathname.split('/').filter(Boolean);
    if (owner && name) return `${owner}/${name.replace(/\.git$/, '')}`;
    if (owner) return owner;
    return u.hostname;
  } catch {
    return 'Repository';
  }
}
