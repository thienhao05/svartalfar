---
title: 'Tăng tốc GitHub Actions bằng cache'
description: 'Bài mẫu. Cache dependency để workflow chạy nhanh hơn, và cách biết cache có trúng hay không.'
date: 2026-09-12
lang: vi
area: experience
categories: ['DevOps']
tags: ['github-actions', 'ci', 'pnpm', 'sample']
related: ['devops/docker-multi-stage-build', 'projects/building-this-archive']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Bối cảnh

Mỗi lần chạy workflow đều cài lại toàn bộ dependency thì rất tốn thời gian. Cache giúp dùng lại những gì không đổi.

## Cấu hình

```yaml
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: 24
    cache: pnpm
- run: pnpm install --frozen-lockfile
```

## Kiểm tra cache có trúng không

Mở log của bước `setup-node`: dòng `Cache restored from key` nghĩa là đã trúng. Nếu luôn là `Cache not found`, kiểm tra xem lockfile có đổi ở mỗi lần chạy không.

## Bài học

- Khoá cache nên gắn với lockfile, không phải ngày tháng.
- Cache quá cũ còn tệ hơn không cache, vì che mất lỗi cài đặt.
