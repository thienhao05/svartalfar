---
title: 'Các lệnh Linux cơ bản nên nhớ'
description: 'Bài mẫu. Tập lệnh làm việc hằng ngày với terminal: di chuyển, xem file, tìm kiếm.'
date: 2026-09-15
lang: vi
area: learning
series: 'Linux basics'
seriesOrder: 1
categories: ['Linux']
tags: ['linux', 'shell', 'sample']
related: ['linux/file-permissions', 'devops/docker-multi-stage-build']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Bối cảnh

Phần lớn công việc trên server là gõ lệnh. Nhớ được vài lệnh nền tảng giúp thao tác nhanh hơn rất nhiều.

## Di chuyển và xem

```bash
pwd          # đang ở đâu
ls -la       # liệt kê, gồm file ẩn
cd ~/projects
cat README.md
```

## Tìm kiếm

```bash
grep -rn "TODO" src/        # tìm chuỗi trong thư mục
find . -name "*.md" -mtime -7   # file .md sửa trong 7 ngày
```

## Bài học rút ra

- Dùng `Tab` để tự hoàn thành, đỡ gõ sai.
- Đọc `man <lệnh>` trước khi hỏi ở nơi khác.
