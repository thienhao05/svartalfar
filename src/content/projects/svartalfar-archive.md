---
title: 'SVARTÁLFAR archive'
description: 'The static site you are reading: a personal knowledge archive built with Astro, kept deliberately small.'
date: 2026-10-29
updated: 2026-10-30
status: active
icon: book
stack: ['Astro', 'TypeScript', 'Tailwind', 'Pagefind']
# TODO(owner): replace with this project's repository URL, e.g. https://github.com/thienhao05/<repo>
repo: 'https://github.com/thienhao05/svartalfar'
---

> **Sample project** that happens to describe this very site accurately. Edit or replace it.

## Why it exists

Notes that stay in scattered files rarely get read twice. This archive keeps what I learn in one place, written so that it can be read again later.

## Core capabilities

- Static output, hosted on GitHub Pages with no server to run.
- Markdown entries validated by a typed schema.
- Full-text search that works offline (Pagefind).
- Dark and light modes derived from one token file.
- Diagrams written as Mermaid code blocks.

## Structure

```mermaid
flowchart LR
  M[Markdown entries] --> A[Astro build]
  C[Site config] --> A
  A --> S[Static HTML and search index]
  S --> G[GitHub Pages]
```

```text
src/
  content/     knowledge and projects, as Markdown
  config/      site.ts, the one place for personal settings
  styles/      tokens.css, global.css, prose.css
  utils/       small pure functions, each with a test
```

## Trade-offs

| Choice               | Gain                          | Cost                          |
| -------------------- | ----------------------------- | ----------------------------- |
| Static generation    | Cheap, fast, nothing to patch | No server-side features       |
| One monospace family | A consistent voice            | Long text is wider than serif |

## What comes next

Learning paths and a journal, once there is enough content to justify them.
