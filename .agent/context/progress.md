# Tiến độ

Cập nhật: 2026-10-30. Chỉ ghi "đã xong" khi có bằng chứng trong code.

## Đã xong (gate xanh: check 0 lỗi, lint, 21 test, build + Pagefind)
- Rule, skill, tài liệu thiết kế (`CLAUDE.md`, `.claude/skills/`, `.agent/context/`).
- Scaffold Astro 7 + Tailwind 4 + MDX + Expressive Code + Pagefind + Mermaid; base path tự nhận từ GitHub Actions.
- Design system: `src/styles/tokens.css` (OKLCH, dark mặc định + light, WCAG AA đã tính), font Maple Mono cho toàn bộ chữ (giống navfolio) + Noto Sans Runic (chỉ Rune). Tiêu đề line-height 1.3 (`--lh-heading`) vì chữ Việt xếp nhiều dấu. hallmark sloplint: sạch, không waiver.
- `RuneMark` là nơi duy nhất render Rune; chuỗi chỉ ở `src/config/site.ts`. Glyph đã chụp màn hình kiểm tra.
- Home (dashboard kiểu navfolio, TASK-006): Rune + slogan nghiêng + giới thiệu, danh sách Recently / Current journey / hashtag, cột phải avatar, thống kê, Latest, heatmap, thẻ điều hướng, icon mạng xã hội.
- Header nổi có viền, nút icon, indicator trượt giữa các tab (nhớ vị trí qua sessionStorage, tắt khi reduced-motion). Search modal có tiêu đề, nút đóng, hiệu ứng mở/đóng.
- Hiệu ứng: hiện dần khi cuộn (`Effects.astro`, chỉ khi có `.js`), hover hàng/chip/thẻ, chuyển trang mượt bằng View Transitions CSS, thanh nav tự ẩn khi cuộn xuống (`utils/scroll.ts`, có test), tab căn giữa.
- Meta bài viết có icon + chip Area/Category; hashtag nhiều màu (6 màu cố định theo tên, `tagColour`).
- Knowledge: list + phân trang, lọc area / category / tag, trang bài (TOC, related, older/newer, Mermaid), RSS, sitemap, 404, search modal Ctrl/Cmd+K.
- Đã bỏ RSS (route, thẻ, icon, link footer, `@astrojs/rss`) và slogan tiếng Việt khỏi giao diện. Thanh Newer/Older cuối bài là hai thẻ có viền accent.
- Projects (TASK-007): collection `projects`, trang danh sách dạng thẻ `/projects/`, trang chi tiết `/projects/[slug]/`, mục menu, thẻ ở trang chủ, có trong search. 4 dự án mẫu (tag `Sample project`).
- Knowledge views (TASK-008): trường `series` / `seriesOrder`, trang `/knowledge/series/`, `/knowledge/tags/` (đám mây), `/knowledge/years/`, nút chuyển Series | Tags | Years, chip Series ở header bài. Ảnh bìa (`heroImage`) hiện ở danh sách và đầu bài, làm mờ.
- Skill bên thứ ba cài local: hallmark, taste-skill, modern-web-design, scroll-reveal-libraries, gsap-scrolltrigger, animejs. Đã chạy `design_audit.py` trên bản build: không có lỗi thật. Font Maple Mono 400 và font Rune được preload.
- View (TASK-009): bản đồ tri thức `/view/`: nhóm theo chủ đề, series thành chuỗi, `related` thành đường nối, dự án thành cụm riêng. Kéo/cuộn/pinch, nút zoom, mini-map, chú giải, phím tắt, panel chi tiết; tính toán trong `utils/graph.ts` và `utils/viewport.ts` (có test). Không có JS thì là sơ đồ tĩnh cuộn được.
- `pnpm knowledge:new <slug>`; workflow `.github/workflows/deploy.yml`.
- 3 bài mẫu (đánh dấu `sample`, nhớ xoá).

## Chưa làm
- Learning Paths, Journal, About (collection + trang).
- Điền thông tin thật vào `src/config/site.ts` (các dòng `TODO(owner)`).
- Chưa chạy `/review-ui` đầy đủ (light mode, 768px, tắt JS, kiểm tra Mermaid và Ctrl+K trên trình duyệt).
- Chưa commit, chưa tạo repo GitHub, chưa deploy.
