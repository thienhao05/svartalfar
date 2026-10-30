---
title: 'The TCP three-way handshake, step by step'
description: 'Sample entry. How two machines agree to talk before any data moves, and what each flag means.'
date: 2026-10-27
lang: en
area: learning
series: 'Networking essentials'
seriesOrder: 2
categories: ['Networking']
heroImage: '../../../assets/samples/sample-teal.jpg'
tags: ['tcp', 'network', 'sample']
related: ['networking/dns-hoat-dong-the-nao', 'backend/retry-exponential-backoff']
---

> **Sample entry** for previewing the layout. Replace with your own notes.

## Why a handshake

TCP promises ordered, reliable delivery. Before it can promise that, both sides must agree on starting sequence numbers.

## The three steps

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: SYN (seq = x)
  S->>C: SYN-ACK (seq = y, ack = x + 1)
  C->>S: ACK (ack = y + 1)
  Note over C,S: Connection established
```

| Step | Flags     | Meaning                             |
| ---- | --------- | ----------------------------------- |
| 1    | `SYN`     | Client proposes a starting sequence |
| 2    | `SYN,ACK` | Server accepts and proposes its own |
| 3    | `ACK`     | Client confirms, data may now flow  |

## Watching it happen

```bash
sudo tcpdump -nn -i any 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' and port 443
```

## Lessons

- A flood of `SYN` without the final `ACK` is a classic resource-exhaustion attack, which is why servers use SYN cookies.
- Each handshake costs one round trip, so reusing connections matters for latency.
