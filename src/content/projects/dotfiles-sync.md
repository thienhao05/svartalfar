---
title: 'Dotfiles sync'
description: 'A tiny setup that keeps shell, editor and Git configuration identical across machines.'
date: 2026-08-30
status: done
icon: terminal
stack: ['Shell', 'Git']
---

> **Sample project.** Replace it with your own.

## Problem

Every new machine started with an hour of remembering how the last one was configured.

## Approach

Keep configuration in one Git repository and link each file into place with a short script.

```bash
#!/usr/bin/env bash
set -euo pipefail

for f in .zshrc .gitconfig; do
  ln -sfn "$PWD/$f" "$HOME/$f"
done
```

## Result

A fresh machine is ready in a few minutes, and a change made once reaches all of them.
