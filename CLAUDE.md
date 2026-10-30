# CLAUDE.md — ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ (SVARTÁLFAR)

Kho tri thức cá nhân dài hạn: kiến thức, kinh nghiệm làm việc, dự án, hành trình phát triển. Không
phải blog lập trình hay portfolio thuần. Slogan: *Document the Journey. Preserve the Knowledge.*

Đọc khi cần:

- Tầm nhìn, nhận diện, nguyên tắc (nguyên văn của chủ project) → `.agent/context/project-context.md`
- Route, content model, design system → `.agent/context/design.md`
- Cái gì đã xong / đang làm → `.agent/context/progress.md`
- Task đang làm → `.agent/workspace/tasks/`

## Luật cứng về nhận diện

- Rune inscription là `ᛋᚹᚨᚱᛏᚨᛚᚠᚨᚱ`, giữ nguyên từng ký tự. Chuỗi này chỉ được khai báo **một lần**
  ở `src/config/site.ts` (`site.rune`), và mọi nơi khác render qua component `RuneMark`.
- Glyph Rune dùng font Noto Sans Runic (self-host). Khi đổi font hoặc layout có Rune, chụp màn hình
  để xác nhận glyph hiện đúng, không phải ô vuông.

## Stack

Astro (static) · TypeScript strict · Tailwind CSS 4 (qua Vite) · MDX · Content Collections ·
Pagefind · Mermaid · Expressive Code · pnpm · GitHub Actions → GitHub Pages (`<username>.github.io`).
Lệnh thực tế xem `package.json`.

## Vai trò

Chủ project là **Product Owner**: duyệt yêu cầu và duyệt bản deploy. Claude đổi "mũ" theo skill:

| Mũ        | Skill                                   | Khi nào                                     |
| --------- | --------------------------------------- | ------------------------------------------- |
| Planner   | `/plan-feature`                         | Ý tưởng tính năng → spec + task file        |
| Developer | `/implement-task`                       | Có task file → code → verify                |
| Designer  | `/hallmark`, `/taste-skill`             | Dựng trang mới / polish giao diện           |
| Reviewer  | `/review-ui`                            | Trước khi merge/deploy thay đổi giao diện   |
| Writer    | `/new-knowledge`, `/new-journal`        | Thêm bài kiến thức / nhật ký hành trình     |
| Release   | `/release`                              | Đưa `main` lên GitHub Pages                 |

Mỗi tính năng mới phải phục vụ mục đích kho tri thức; khi đề xuất, nói rõ nó giúp gì. Thay đổi lớn
về kiến trúc hoặc thiết kế: giải thích lý do bằng lời dễ hiểu, chờ chủ project đồng ý rồi mới làm.

## Quality gates (bắt buộc)

1. Tính năng lớn (route mới, collection mới, đổi layout) phải có task file trong
   `.agent/workspace/tasks/` **trước** khi code. Sửa nhỏ/nội dung thì không cần.
2. Trước khi báo "xong": `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm build` đều xanh.
   Báo đúng kết quả, kể cả khi đỏ.
3. Thay đổi UI: kiểm tra ở 375 / 768 / 1280px, cả dark lẫn light.
4. Logic thuần trong `src/utils/` có unit test (Vitest). Component/trang không bắt buộc test.

## Quy tắc code

- Link nội bộ và asset đi qua `withBase()` (`src/utils/url.ts`), để đổi repo vẫn chạy.
- Cấu hình cá nhân (tên, nav, social, "current journey") nằm duy nhất ở `src/config/site.ts`, có Zod
  validate. Component đọc từ đó; text cá nhân không viết cứng trong component.
- Schema nội dung nằm duy nhất ở `src/content.config.ts`. Thêm field → cập nhật schema và template
  `scripts/templates/` cùng lúc.
- Màu, font, spacing, radius, motion đi qua token trong `src/styles/tokens.css` (OKLCH). Không dùng màu
  hoặc `font-family` literal ngoài khối token.
- Đổi cấu hình Markdown / Expressive Code / remark thì xoá cache render: `rm -rf .astro node_modules/.astro`
  (Astro cache HTML bài viết, bản cũ có thể trỏ tới file CSS không còn tồn tại, khối code mất style).
- Trang đọc được khi tắt JS. JS chỉ để tăng cường (search, theme toggle, TOC spy, mermaid).
- Component Astro mặc định; chỉ dùng island `client:*` khi thật sự cần.
- Giao diện (nav, nhãn, nút) viết tiếng Anh; bài viết có `lang: vi | en`, và trang đặt `lang` theo bài.

## Phong cách thiết kế

Bố cục theo [astro-navfolio](https://github.com/dodolalorc/astro-navfolio) (MIT): dashboard 2 cột,
top nav nổi, archive dạng danh sách đánh số, bài viết có TOC bên phải. Không khí theo context:
**một thư viện cổ ẩn dưới lòng đất**: bí ẩn, chiều sâu, lưu giữ. Đọc tốt là trên hết: tiết chế hiệu ứng,
tương phản ≥ WCAG AA. Palette không cố định, nhưng mọi thay đổi màu đi qua token.

### Skill thiết kế bên thứ ba (vendored, chỉ local trong `.claude/skills/`)

- `hallmark` (Nutlope/hallmark @ 4f6a46c, MIT): "The Floor" của nó là luật cứng cho mọi CSS
  (token, `:focus-visible`, `prefers-reduced-motion`, không eyebrow / chữ hoa giãn cách / chuỗi nối bằng
  dấu chấm giữa, không bịa số liệu). Chỉ chạy `redesign`/`audit` khi chủ project gọi tên.
- `taste-skill` (Leonxlnx/taste-skill @ 12af471, MIT): dùng khi review/polish. Blog là trang để đọc,
  nên dùng run "page" (không dùng `--app`).
- Bộ skill animation / design của freshtechbro/claudedesignskills @ 1da73fe (MIT), cài local:
  `modern-web-design` (checklist a11y, hiệu năng; `scripts/design_audit.py` kiểm tra HTML đã build,
  chạy bằng `python3 -I`), `scroll-reveal-libraries`, `gsap-scrolltrigger`, `animejs`. Ba skill sau
  mô tả thư viện JS (AOS, GSAP, Anime.js): dự án này làm hiệu ứng bằng CSS + vài dòng JS, nên chỉ
  thêm thư viện khi một task chứng minh được CSS không đủ. Các skill 3D/WebGL còn lại của repo đó
  chưa cài vì site không có 3D.
- Khi skill gợi ý ngược bố cục navfolio hoặc nhận diện SVARTÁLFAR, lời chủ project thắng. Ghi lý do
  trong stamp CSS hoặc task file.
- Không chạy `hallmark/scripts/install*.mjs` (chúng ghi vào `~/.claude`, tức là cài global).
- Cập nhật skill: clone lại repo gốc, đọc diff, chép đè thư mục skill, sửa commit hash ở đây.

## Nội dung

- `src/content/knowledge/` là bài kiến thức (có `area`: learning | experience | projects | personal).
- Learning Paths, Projects, Journal, About: collection sẽ thêm ở các task sau (xem `design.md`).
- Slug file viết `kebab-case` không dấu. `draft: true` không được build ra production.
- Không bịa số liệu, trích dẫn hay thành tích cá nhân. Thiếu thông tin thì để slot trống và hỏi.

## Git

- Nhánh `main` (deploy) và nhánh làm việc `feat/…`, `fix/…`, `content/…`, `chore/…`.
- Commit theo Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`, `chore:`).
- Commit/push chỉ khi chủ project yêu cầu. Không commit secret.

## Bảo trì bộ nhớ agent

- Đổi kiến trúc/route/schema/token → cập nhật `.agent/context/design.md`.
- Hoàn thành/bắt đầu tính năng → cập nhật `.agent/context/progress.md` (chỉ ghi "đã xong" khi có
  bằng chứng trong code).
