---
title: 'Index trong SQL: khi nào giúp nhanh, khi nào vô ích'
description: 'Bài mẫu. Hiểu index bằng ví dụ, và cách kiểm tra truy vấn có thật sự dùng nó không.'
date: 2026-10-20
lang: vi
area: learning
series: 'Databases in practice'
seriesOrder: 1
categories: ['Databases']
tags: ['sql', 'postgres', 'performance', 'sample']
related: ['databases/postgres-explain', 'linux/file-permissions']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Ý tưởng chính

Index giống mục lục cuối sách: thay vì lật từng trang, bạn tra mục lục rồi nhảy tới đúng chỗ.

## Ví dụ

```sql
CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id bigint NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
```

## Khi nào index có ích

| Tình huống                     | Index giúp?   | Lý do                               |
| ------------------------------ | ------------- | ----------------------------------- |
| `WHERE customer_id = 42`       | Có            | Tra thẳng tới các dòng khớp         |
| `WHERE lower(email) = 'a@b.c'` | Không         | Hàm bao ngoài cột làm index vô hiệu |
| Bảng chỉ vài trăm dòng         | Gần như không | Quét cả bảng còn nhanh hơn          |

## Cái giá phải trả

Mỗi index làm việc ghi chậm hơn và tốn thêm dung lượng, nên chỉ tạo index cho truy vấn thật sự chạy nhiều.

## Bài học

- Luôn kiểm tra bằng `EXPLAIN` thay vì đoán.
- Index nhiều cột phụ thuộc thứ tự cột.
