---
title: 'Homelab notes'
description: 'A small home server used to practise Linux administration, networking and backups without risking anything important.'
date: 2026-09-18
status: active
icon: server
stack: ['Linux', 'Docker', 'WireGuard']
---

> **Sample project.** Replace it with your own setup.

## Goal

A safe place to break things. Everything on it can be rebuilt from notes and a few config files.

## What runs on it

- A reverse proxy in front of a handful of containers.
- A VPN so the lab is reachable without opening ports.
- Nightly backups of configuration, not of disposable data.

## Rebuild routine

```bash
git clone https://example.com/homelab-config.git
cd homelab-config
docker compose up -d
```

## Lessons

- Document the rebuild before building anything else.
- A backup that was never restored is only a hope.
