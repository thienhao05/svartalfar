# ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ SVARTÁLFAR

**Document the Journey. Preserve the Knowledge.**

SVARTÁLFAR is a personal knowledge archive: a static website where I write down what I learn, what I build and what work teaches me. It is not a programming blog or a portfolio. It is a place to collect knowledge, connect it, and look back at how understanding grew over time.

The name comes from the Svartálfar of Norse mythology. The rune inscription `ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ` is the project's visual identity.

**Live site:** https://thienhao05.github.io/svartalfar/ (available once the GitHub Pages workflow has run, see [Deployment](#deployment))

## What is in it

| Section             | What it holds                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Home**            | Introduction, latest entries, writing activity, current journey, featured topics                        |
| **Knowledge**       | Notes and articles by area (Learning, Experience, Projects, Personal), with categories, tags and series |
| **Knowledge views** | The same entries browsed by **Series**, as a rotating **Tags** cloud, or grouped by **Year**            |
| **Projects**        | A shelf of project cards, each with a full write-up, status, stack and links to its repository          |
| **View**            | An interactive **knowledge map**: topics as columns, series as chains, related entries as wires         |
| **Search**          | Full-text search (`Ctrl/Cmd + K`), built with Pagefind                                                  |

Learning Paths, Journal and About are planned next; they are not built yet.

## Features

- **Static and fast.** Everything is generated at build time and hosted on GitHub Pages. There is no server, database or account.
- **Typed content.** Entries are Markdown files validated by a schema, so a typo in front matter fails the build instead of the site.
- **Diagrams in Markdown.** Write a ` ```mermaid ` code block and it is drawn in the browser, only on pages that contain one.
- **Dark and light modes**, both derived from one token file, with WCAG AA contrast.
- **Accessible by default.** Keyboard navigation everywhere, visible focus, `prefers-reduced-motion` respected, and pages that read without JavaScript.
- **Vietnamese and English.** The interface is English; each entry declares its own language (`vi` or `en`).
- **Small by design.** No UI framework, no animation library: motion is CSS plus a few lines of JavaScript.

## Tech stack

[Astro 7](https://astro.build) · TypeScript (strict) · [Tailwind CSS 4](https://tailwindcss.com) · Markdown and MDX · Astro Content Collections · [Pagefind](https://pagefind.app) · [Mermaid](https://mermaid.js.org) · [Expressive Code](https://expressive-code.com) · Vitest · pnpm · GitHub Actions and GitHub Pages.

Fonts are self-hosted: [Maple Mono](https://github.com/subframe7536/maple-font) for text and code (it covers every Vietnamese letter), and Noto Sans Runic for the inscription.

## Getting started

Requirements: **Node.js 22.23.4 or newer** and **pnpm 12**.

```bash
pnpm install
pnpm dev          # development server at http://localhost:4321
```

| Command                     | What it does                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm start`   | Start the development server                                                          |
| `pnpm build`                | Build the site into `dist/` and create the search index                               |
| `pnpm preview`              | Serve the production build locally                                                    |
| `pnpm check`                | Type-check the project (`astro check`)                                                |
| `pnpm lint`                 | ESLint and Prettier checks                                                            |
| `pnpm format`               | Format all files with Prettier                                                        |
| `pnpm test`                 | Run the unit tests                                                                    |
| `pnpm knowledge:new <slug>` | Create a new knowledge entry from the template (`linux/permissions` creates a folder) |

> If you change Markdown, Expressive Code or content-schema settings, clear the render cache first: `rm -rf .astro node_modules/.astro`.

## Writing content

### Knowledge entries

Create a file in `src/content/knowledge/` (or run `pnpm knowledge:new <slug>`):

```yaml
---
title: 'Linux file permissions in five minutes'
description: 'One sentence shown in lists and search.'
date: 2026-10-02
updated: 2026-10-20 # optional
draft: false # drafts appear in dev only
lang: en # en | vi
area: learning # learning | experience | projects | personal
categories: ['Linux']
series: 'Linux basics' # optional
seriesOrder: 2 # optional position inside the series
tags: ['linux', 'shell']
related: ['linux/lenh-co-ban'] # ids of other entries, drawn as links on the map
heroImage: '../../../assets/cover.jpg' # optional cover, shown softly blurred
toc: true
---
```

### Projects

Create a file in `src/content/projects/`:

```yaml
---
title: 'Homelab notes'
description: 'What it is and why it exists.'
date: 2026-09-18
status: active # active | done | archived
icon: server # any icon name from src/config/icons.ts
stack: ['Linux', 'Docker']
repo: 'https://github.com/<user>/<repo>' # optional, shown as owner/name
demo: 'https://example.com' # optional
---
```

### Site settings

Personal settings (profile, avatar, navigation, motto, home page cards) live in one validated file: `src/config/site.ts`. The rune inscription is defined there once and rendered everywhere through the `RuneMark` component.

> The bundled entries and projects are **samples** (tagged `sample`). Replace or delete them with your own.

## Project structure

```text
src/
  config/        site.ts (all personal settings), icons.ts
  content/       knowledge/ and projects/ as Markdown
  components/    UI: cards, header, search, knowledge views, the knowledge map
  layouts/       BaseLayout
  pages/         routes: /, /knowledge/*, /projects/*, /view/
  styles/        tokens.css (colours, type, spacing), global.css, prose.css
  utils/         small pure functions, each with a unit test
scripts/         content scaffolding
public/          avatar, favicon
.github/         GitHub Pages workflow
```

Design tokens are the single source of truth for colour, type, spacing and motion; components never hard-code them.

## Deployment

The site deploys to GitHub Pages through `.github/workflows/deploy.yml`. On every push to `main` it installs dependencies, runs `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build`, then publishes `dist/`.

One-time setup in the repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`, or run the workflow manually from the **Actions** tab.

The base path is detected automatically. A repository named `<user>.github.io` is served from `/`; any other repository, such as `svartalfar`, is served from `/<repo>/`. To override it, set `SITE_URL` and `SITE_BASE` when building:

```bash
SITE_URL=https://example.com SITE_BASE=/ pnpm build
```

## Testing

```bash
pnpm test
```

Unit tests cover the pure logic: URL handling, content grouping, pagination, heatmap, tag colours, scroll behaviour, search matching, the orbit and map maths, and edge routing for the knowledge map.

## Working with Claude Code

The repository carries rules and skills for [Claude Code](https://claude.com/claude-code):

- `CLAUDE.md` holds the project rules, quality gates and design direction.
- `.agent/context/` holds the vision, design notes and progress; `.agent/workspace/tasks/` holds one task file per larger feature.
- `.claude/skills/` holds project-local skills for planning, implementing, reviewing and releasing, plus vendored design skills (listed below).

## Credits and licences

- Layout inspiration: [astro-navfolio](https://github.com/dodolalorc/astro-navfolio) (MIT). This project is an independent implementation and does not depend on its packages.
- Vendored design skills, all MIT: [hallmark](https://github.com/Nutlope/hallmark), [taste-skill](https://github.com/Leonxlnx/taste-skill), and four skills from [claudedesignskills](https://github.com/freshtechbro/claudedesignskills). Their licences are kept alongside them in `.claude/skills/`.

## Licence

[MIT](LICENSE) © 2026 thienhao05
