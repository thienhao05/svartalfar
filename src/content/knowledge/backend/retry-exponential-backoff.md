---
title: 'Retry với exponential backoff và jitter'
description: 'Bài mẫu. Cách thử lại khi gọi dịch vụ lỗi mà không làm hệ thống đang yếu sập hẳn.'
date: 2026-08-28
lang: vi
area: learning
series: 'Reliable services'
seriesOrder: 1
categories: ['Backend']
tags: ['api', 'reliability', 'typescript', 'sample']
related: ['backend/idempotent-api']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Vấn đề

Nếu mọi client cùng thử lại ngay lập tức, dịch vụ đang quá tải sẽ nhận thêm một đợt tải nữa và sập hẳn.

## Cách làm

Chờ lâu dần sau mỗi lần thất bại (gấp đôi thời gian chờ), và cộng thêm một khoảng ngẫu nhiên (**jitter**) để các client không đồng loạt quay lại.

```ts
async function withRetry<T>(fn: () => Promise<T>, max = 5): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= max) throw err;
      const base = Math.min(30_000, 200 * 2 ** attempt);
      const wait = Math.random() * base; // full jitter
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}
```

## Bài học

- Chỉ thử lại những lỗi tạm thời (mạng, 503), không thử lại lỗi 400.
- Chỉ thử lại thao tác **idempotent**, nếu không có thể thực hiện hai lần.
