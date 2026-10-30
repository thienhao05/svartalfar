---
name: new-journal
description: Thêm mục nhật ký hành trình (suy ngẫm khi học, kinh nghiệm làm việc, khám phá, bài học) vào src/content/journal. Dùng khi chủ project kể về khóa học, công việc, dự án hoàn thành, bài học, hoặc nói "journal", "nhật ký", "hành trình".
---

# New journal entry

1. Nếu collection `journal` chưa có trong `src/content.config.ts`, dừng lại và đề xuất chạy
   `/plan-feature` cho trang Journal trước.
2. Thu thập: ngày, loại (reflection | work | discovery | lesson), tóm tắt 1–3 câu, kỹ năng/chủ đề, link.
   Hỏi lại phần còn thiếu; không tự bịa chi tiết.
3. Tạo `src/content/journal/<yyyy-mm-dd>-<slug>.md` theo schema `journal`.
4. Tìm bài knowledge liên quan (grep theo tag/category) và đề xuất `related`.
5. Viết ngôi thứ nhất, cụ thể: đã làm gì, học được gì, sẽ làm khác đi thế nào.
