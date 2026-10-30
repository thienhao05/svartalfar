// @ts-check
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

import { remarkMermaid } from './src/utils/remark-mermaid.ts';

/**
 * GitHub Pages: `<owner>.github.io` repos serve at `/`, any other repo serves at `/<repo>/`.
 * SITE_URL / SITE_BASE override both, for custom domains or local base-path testing.
 */
function resolveSite() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
  const isUserPage = owner && repo === `${owner}.github.io`;
  const ghSite = owner ? `https://${owner}.github.io` : undefined;
  const ghBase = owner && repo && !isUserPage ? `/${repo}` : '/';

  return {
    site: process.env.SITE_URL || ghSite || 'https://example.github.io',
    base: process.env.SITE_BASE || ghBase,
  };
}

const { site, base } = resolveSite();

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri, so the mermaid remark plugin runs;
    // MDX inherits this processor.
    processor: unified({ remarkPlugins: [remarkMermaid] }),
  },
  integrations: [
    expressiveCode({
      themes: ['github-dark-dimmed', 'github-light'],
      // <html data-mode="dark|light"> is always set (see BaseLayout), so each theme gets a plain selector.
      themeCssSelector: (theme) => `[data-mode="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        codeFontFamily: 'var(--font-mono)',
        codeBackground: 'var(--color-paper-2)',
        borderRadius: 'var(--radius-sm)',
        borderColor: 'var(--color-rule)',
        // Frames, title bars and buttons follow the site palette in both modes; the syntax
        // themes only supply the token colours.
        frames: {
          frameBoxShadowCssValue: 'none',
          terminalBackground: 'var(--color-paper-2)',
          terminalTitlebarBackground: 'var(--color-paper-3)',
          terminalTitlebarBorderBottomColor: 'var(--color-rule)',
          terminalTitlebarForeground: 'var(--color-muted)',
          terminalTitlebarDotsForeground: 'var(--color-muted)',
          terminalTitlebarDotsOpacity: '0.5',
          editorBackground: 'var(--color-paper-2)',
          editorTabBarBackground: 'var(--color-paper-3)',
          editorTabBarBorderBottomColor: 'var(--color-rule)',
          editorActiveTabBackground: 'var(--color-paper-2)',
          editorActiveTabForeground: 'var(--color-ink)',
          editorActiveTabBorderColor: 'var(--color-rule)',
          editorActiveTabIndicatorTopColor: 'var(--color-accent)',
          inlineButtonForeground: 'var(--color-ink-2)',
          inlineButtonBackground: 'var(--color-paper-3)',
          inlineButtonBorder: 'var(--color-rule-strong)',
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
