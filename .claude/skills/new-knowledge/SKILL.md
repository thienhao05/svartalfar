---
name: new-knowledge
description: Tạo bài kiến thức mới trong src/content/knowledge. Dùng khi chủ project muốn viết bài, ghi lại kiến thức, tutorial, kinh nghiệm làm việc, hoặc chuyển ghi chú thành bài.
---

# New knowledge entry

1. Hỏi (nếu chưa rõ): chủ đề, `area` (learning | experience | projects | personal), `lang` (vi | en),
   và mức độ (ghi chú nhanh hay bài hoàn chỉnh).
2. Chọn category/tag **từ những cái đã có** (grep frontmatter trong `src/content/knowledge/`); chỉ tạo
   mới khi thật sự khác chủ đề.
3. Tạo file bằng `pnpm knowledge:new <slug>` (slug kebab-case không dấu), rồi điền frontmatter theo
   schema `knowledge` trong `src/content.config.ts`.
4. Khung bài (theo Content Philosophy): Bối cảnh / vấn đề → Giải thích rõ → Ví dụ thực tế / code →
   Ứng dụng thực tế → Bài học rút ra → Liên quan (`related`) → Tham khảo.
5. Diagram dùng code block ```` ```mermaid ````.
6. Giữ `draft: true` cho tới khi chủ project duyệt.
