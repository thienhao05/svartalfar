---
title: 'Reading EXPLAIN ANALYZE without fear'
description: 'Sample entry. The five lines of a query plan worth reading first, and what a slow one looks like.'
date: 2026-09-30
updated: 2026-10-18
lang: en
area: experience
series: 'Databases in practice'
seriesOrder: 2
categories: ['Databases']
tags: ['postgres', 'performance', 'sql', 'sample']
related: ['databases/sql-index-co-ban']
---

> **Sample entry** for previewing the layout. Replace with your own notes.

## Context

A query plan looks intimidating, but a few numbers answer most questions: where the time went, and how wrong the planner's guess was.

## Read in this order

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;
```

1. **Node type**: `Seq Scan` on a large table is the first suspect.
2. **Actual time**: the last number is the total for that node.
3. **Rows vs estimated rows**: a large gap means stale statistics.
4. **Loops**: multiply per-loop time by loops.
5. **Buffers**: shared reads mean the data came from disk.

## What went wrong, typically

- Missing index on a filtered column.
- Statistics out of date; run `ANALYZE`.
- A function wrapped around an indexed column.

## Lessons

- Fix the biggest node first; tuning the rest rarely matters.
- Re-run after every change and compare, not remember.
