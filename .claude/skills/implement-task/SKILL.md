---
name: implement-task
description: Thực thi một task file TASK-xxx của blog. Dùng khi chủ blog nói "làm TASK-", "implement", "code tính năng".
---

# Implement task

1. Đọc task file, `CLAUDE.md` và phần liên quan trong `.agent/context/design.md`. Đặt `status: doing`.
2. Tạo nhánh theo `branch` trong task (từ `main`), nếu repo đã có git.
3. Logic thuần (`src/utils/`): viết test Vitest trước, chạy cho đỏ, rồi implement cho xanh.
4. UI: dựng bằng component Astro + token CSS; link nội bộ qua `withBase()`.
5. Chạy `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm build`. Sửa đến khi tất cả xanh.
6. UI thay đổi → chạy skill `review-ui`.
7. Xong khi: từng dòng `acceptance` đã được kiểm tra và ghi kết quả. Đặt `status: review`,
   cập nhật `.agent/context/progress.md`, báo chủ blog kèm danh sách file đã đổi.
