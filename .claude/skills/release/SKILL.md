---
name: release
description: Đưa blog lên GitHub Pages. Dùng khi chủ blog nói "deploy", "release", "publish site".
---

# Release

1. Trên `main`, working tree sạch: `pnpm check && pnpm lint && pnpm test && pnpm build` đều xanh.
2. `pnpm preview`: mở trang chủ, một bài blog, `/journey`, search (Ctrl/Cmd+K), RSS.
3. Kiểm tra không có bài `draft: true` trong `dist/`.
4. Trình kết quả cho chủ blog và **chờ duyệt** trước khi push.
5. Push `main` → workflow `.github/workflows/deploy.yml` chạy. Theo dõi bằng `gh run watch`.
6. Xong khi: workflow xanh và URL Pages trả về trang mới. Báo URL cho chủ blog.
