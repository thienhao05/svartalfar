---
title: 'Linux file permissions in five minutes'
description: 'Sample entry. How read, write and execute bits work, and how to read the output of ls -l.'
date: 2026-10-02
updated: 2026-10-20
lang: en
area: learning
series: 'Linux basics'
seriesOrder: 2
categories: ['Linux']
heroImage: '../../../assets/samples/sample-teal.jpg'
tags: ['linux', 'shell', 'sample']
related: ['linux/lenh-co-ban']
---

> This is a **sample entry** that shows the layout. Replace it with your own notes.

## Context

Every file on Linux has an owner, a group and three permission sets. Understanding them removes most "permission denied" surprises.

## Reading `ls -l`

```bash
ls -l notes.txt
# -rw-r--r-- 1 hao users 120 Oct  2 09:00 notes.txt
```

The first column is `-rw-r--r--`: file type, then owner, group and others, each as `rwx`.

| Bits  | Octal | Meaning              |
| ----- | ----- | -------------------- |
| `rwx` | 7     | read, write, execute |
| `r-x` | 5     | read and execute     |
| `r--` | 4     | read only            |

## Changing them

```bash
chmod 640 notes.txt   # owner rw, group r, others none
chmod +x script.sh    # add execute for everyone
```

## How a check flows

```mermaid
flowchart LR
  A[Process opens file] --> B{Is owner?}
  B -- yes --> C[Use owner bits]
  B -- no --> D{In group?}
  D -- yes --> E[Use group bits]
  D -- no --> F[Use other bits]
```

## Lessons

- Prefer `640` or `600` for anything personal.
- `x` on a directory means "may enter it".
