---
name: review-ui
description: Checklist review giao diện blog trước khi merge/deploy. Dùng sau khi đổi component, layout, style, route, hoặc khi chủ blog nói "review".
---

# Review UI

Áp dụng **mọi** mục; ghi Pass/Fail + bằng chứng cho từng mục.

- **Responsive**: 375px không có scroll ngang; ≥1280px đúng layout 2 cột.
- **Theme**: light và dark đều đọc được; tương phản chữ đạt WCAG AA.
- **Base path**: build với `SITE_BASE=/test-repo/`, rồi mở link nav, ảnh, RSS, search. Không link nào gãy.
- **No-JS**: tắt JS, nội dung bài và nav vẫn đọc được.
- **A11y**: heading đúng thứ bậc, ảnh có `alt`, focus ring thấy được, điều khiển được bằng bàn phím.
- **Tiếng Việt**: dấu hiển thị đúng ở mọi font (heading, body, code).
- **Motion**: animation tắt khi `prefers-reduced-motion: reduce`.
- **Hiệu năng**: không thêm island `client:*` thừa; ảnh qua `astro:assets`.

Xong khi: mọi mục có kết quả. Mục Fail → sửa hoặc báo chủ blog.
