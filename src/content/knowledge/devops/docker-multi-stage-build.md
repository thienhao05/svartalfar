---
title: 'Multi-stage Docker builds for smaller images'
description: 'Sample entry. Build in one stage, ship only the result in another.'
date: 2026-10-08
lang: en
area: learning
categories: ['DevOps']
heroImage: '../../../assets/samples/sample-rose.jpg'
tags: ['docker', 'ci', 'sample']
related: ['devops/github-actions-cache', 'linux/systemd-service-co-ban']
---

> **Sample entry** for previewing the layout. Replace with your own notes.

## The problem

Build tools (compilers, package managers) are needed to build an app but not to run it. Shipping them makes images large and widens the attack surface.

## The pattern

```dockerfile
# Stage 1: build
FROM node:24 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: run
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## Why it works

Only the files copied with `COPY --from=build` reach the final image. Everything else in the first stage is discarded.

## Lessons

- Copy lockfiles first so dependency layers are cached.
- Pin base image versions for reproducible builds.
