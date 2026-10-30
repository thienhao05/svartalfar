---
title: 'Viết một systemd service đầu tiên'
description: 'Bài mẫu. Chạy một chương trình như dịch vụ nền, tự khởi động lại khi lỗi.'
date: 2026-09-05
lang: vi
area: learning
series: 'Linux basics'
seriesOrder: 3
categories: ['Linux']
tags: ['linux', 'systemd', 'sample']
related: ['linux/file-permissions', 'linux/lenh-co-ban']
---

> Đây là **bài mẫu** để xem bố cục. Hãy thay bằng ghi chú của bạn.

## Bối cảnh

Chạy chương trình bằng tay trong terminal sẽ dừng khi bạn đóng cửa sổ. `systemd` giữ nó chạy, khởi động cùng máy và tự dựng lại khi lỗi.

## Tệp unit

```ini
# /etc/systemd/system/hello.service
[Unit]
Description=Hello service
After=network.target

[Service]
ExecStart=/usr/local/bin/hello
Restart=on-failure
User=hello

[Install]
WantedBy=multi-user.target
```

## Các lệnh cần nhớ

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hello
systemctl status hello
journalctl -u hello -f
```

## Bài học

- Chạy dịch vụ bằng một user riêng, không dùng root.
- `journalctl -u` là nơi đầu tiên cần xem khi dịch vụ không lên.
