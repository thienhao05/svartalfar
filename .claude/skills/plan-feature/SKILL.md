---
name: plan-feature
description: Biến ý tưởng tính năng blog thành spec + task file. Dùng khi chủ blog mô tả tính năng mới, trang mới, collection mới, hoặc nói "plan", "lên kế hoạch", "thiết kế".
---

# Plan feature

1. Đọc `.agent/context/design.md` và `.agent/context/progress.md`.
2. Tóm lại yêu cầu bằng 3–5 gạch đầu dòng. Liệt kê **câu hỏi mở** thật sự ảnh hưởng tới thiết kế
   (dữ liệu nào, hiển thị ở đâu, mobile ra sao) và hỏi chủ blog. Dừng ở đây nếu còn câu hỏi mở.
3. Chia thành task nhỏ, mỗi task merge độc lập được. Mỗi task là một file
   `.agent/workspace/tasks/TASK-<số>-<tên>.yaml` theo `TASK-000-template.yaml`.
4. Xong khi: mọi task có `acceptance` kiểm tra được, và `design.md` đã cập nhật nếu route,
   schema hoặc cấu trúc thay đổi.
5. Trình danh sách task cho chủ blog duyệt; chưa code.
