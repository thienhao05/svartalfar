---
title: 'CLI bookmarks'
description: 'An experiment: a command-line tool that stores and searches links from the terminal.'
date: 2026-07-12
status: archived
icon: code
stack: ['TypeScript', 'Node.js', 'SQLite', 'CLI']
---

> **Sample project.** Replace it with your own experiment.

## Idea

Save a link with one command and find it again with a fuzzy search, without leaving the terminal.

## Usage

```bash
mark add https://example.com "Interesting article" --tag reading
mark find article
```

## Why it was archived

The browser already did this well enough. The experiment taught more about argument parsing and local storage than it ever saved in time.

## Lessons

- Try the built-in tool for a week before building a replacement.
- A small experiment is still worth writing up.
