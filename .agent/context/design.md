# Thiết kế & kiến trúc

Trạng thái: Home + Knowledge đã dựng; các mục còn lại là đề xuất. Xem `progress.md`.
Nhận diện và tầm nhìn: `project-context.md` (nguồn sự thật).

## Ý tưởng sản phẩm

Một "không gian xuất bản cá nhân" gồm 3 trục:

1. **Kiến thức**: bài viết dài, tutorial, ghi chép kỹ thuật, có tag, category và series (lộ trình đọc).
2. **Hành trình (journey)**: timeline các mốc học tập/làm việc (khóa học, chứng chỉ, công việc,
   dự án, bài học rút ra), liên kết ngược tới bài kiến thức liên quan.
3. **Danh tính**: trang chủ dạng dashboard cho biết bạn là ai, đang làm gì, tìm bạn ở đâu.

## Route

```text
/                       Dashboard: intro, đang làm gì, profile, bài mới, heatmap viết bài, liên hệ
/blog                   Danh sách bài (phân trang)
/blog/[slug]            Bài viết: TOC, series progress, related posts, comment
/blog/tags/[tag]        Theo tag
/blog/categories/[c]    Theo category
/blog/series/[s]        Theo series (thứ tự đọc)
/blog/archives          Lưu trữ theo năm
/journey                Timeline hành trình (lọc theo loại / năm)
/projects, /projects/[slug]
/notes                  Ghi chú ngắn / TIL (tương đương "Vibe" của navfolio)
/about                  Giới thiệu
/rss.xml, /sitemap-index.xml, /404
```

## Content model (Zod, `src/content.config.ts`)

```yaml
# blog
title, description, date, updated?, draft=false, tags[], categories[], series?, seriesOrder?,
heroImage?, comments=true, toc=true

# journey
title, date, endDate?, type: learning | work | project | milestone | certificate,
organization?, summary, skills[], links[{label, href}], relatedPosts[] (slug blog)

# projects
title, description, date, status: active | done | archived, stack[], repo?, demo?, heroImage?

# notes
date, tags[], body ngắn (không cần title)
```

## Cấu trúc thư mục dự kiến

```text
src/
  config/site.ts          Cấu hình người dùng (Zod)
  content.config.ts       Schema các collection
  content/{blog,journey,projects,notes}/, content/about.mdx
  components/{layout,cards,blog,journey,widgets,comments}/
  layouts/{BaseLayout,ArticleLayout}.astro
  pages/
  styles/{tokens.css,global.css,prose.css}
  utils/                  url.ts (withBase), content.ts, toc.ts, heatmap.ts (+ *.test.ts)
scripts/new-content.ts, scripts/templates/*.md
.github/workflows/deploy.yml
```

## Học từ navfolio

| Lấy                                         | Bỏ / đơn giản hóa                                    |
| ------------------------------------------- | ---------------------------------------------------- |
| Dashboard 2 cột (main 760px + aside ~280px) | Hệ sinh thái `@navfolio/*`, plugin/module registry   |
| Palette theo CSS variable, light/dark       | Subset font CJK (cần Python), thay bằng font hỗ trợ tiếng Việt |
| Categories / series / archives / TOC        | 3 provider comment, chỉ giữ Giscus                   |
| Pagefind search + Ctrl/Cmd+K                | Submodule docs, Media page                           |
| Tự xử lý `base` khi chạy GitHub Actions     | Cấu hình TOML, thay bằng `site.ts` typed             |
| Script tạo bài từ template                  |                                                      |

## Deploy

GitHub Actions → `withastro/action` → `actions/deploy-pages`. `site`/`base` lấy từ biến môi trường
(`GITHUB_REPOSITORY`): repo `<user>.github.io` thì base `/`, repo khác thì base `/<repo>/`.
