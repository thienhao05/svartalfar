---
title: 'Making an API safe to retry with idempotency keys'
description: 'Sample entry. Why a repeated request must not charge twice, and the small mechanism that prevents it.'
date: 2026-09-22
lang: en
area: experience
series: 'Reliable services'
seriesOrder: 2
categories: ['Backend']
tags: ['api', 'reliability', 'design', 'sample']
related: ['backend/retry-exponential-backoff', 'databases/postgres-explain']
---

> **Sample entry** for previewing the layout. Replace with your own notes.

## Problem

Networks fail halfway. A client that never saw the response will retry, and the server must not perform the action twice.

## Mechanism

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Server
  participant D as Store
  C->>S: POST /payments (Idempotency-Key: k1)
  S->>D: lookup k1
  D-->>S: not found
  S->>S: perform payment
  S->>D: save k1 with result
  S-->>C: 201 Created
  C->>S: retry POST (Idempotency-Key: k1)
  S->>D: lookup k1
  D-->>S: saved result
  S-->>C: same 201 response
```

## Rules that keep it correct

1. The client generates the key, once per logical action.
2. The server stores the **result**, not just the fact it happened.
3. Keys expire after a documented window.

## Lessons

- Idempotency belongs in the contract, not as a hope.
- Reusing a key with a different body should be rejected.
