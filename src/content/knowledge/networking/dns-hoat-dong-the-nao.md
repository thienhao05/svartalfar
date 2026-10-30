---
title: 'DNS hoạt động như thế nào khi bạn gõ một địa chỉ web'
description: 'Bài mẫu. Hành trình từ tên miền đến địa chỉ IP, qua resolver, root, TLD và authoritative server.'
date: 2026-10-14
updated: 2026-10-25
lang: vi
area: learning
series: 'Networking essentials'
seriesOrder: 1
categories: ['Networking']
tags: ['dns', 'network', 'sample']
related: ['networking/tcp-handshake']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Bối cảnh

Máy tính nói chuyện bằng địa chỉ IP, còn con người nhớ tên miền. DNS là cuốn danh bạ nối hai thứ đó.

## Các bước tra cứu

```mermaid
flowchart LR
  A[Trình duyệt] --> B[Resolver của ISP]
  B --> C[Root server]
  C --> D[TLD server .com]
  D --> E[Authoritative server]
  E --> B
  B --> A
```

1. Trình duyệt hỏi **resolver** (thường do nhà mạng cung cấp).
2. Resolver hỏi **root** để biết ai quản lý `.com`.
3. **TLD server** chỉ tới máy chủ quản lý tên miền cụ thể.
4. **Authoritative server** trả về địa chỉ IP, kèm TTL để lưu đệm.

## Thử bằng dòng lệnh

```bash
dig +trace example.com
dig example.com A +short
```

## Bài học

- Hầu hết các lần tra cứu được trả lời từ bộ nhớ đệm, nên đổi bản ghi DNS thường không có hiệu lực ngay.
- Muốn đổi nhanh, hãy hạ TTL **trước** khi thay đổi.
