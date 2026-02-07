# PettyQuiz - Hệ thống ôn luyện trắc nghiệm thông minh

## 📝 Mục đích dự án
PettyQuiz là một ứng dụng web hiện đại được thiết kế để giúp học sinh lớp 12 (và các cấp độ khác) ôn luyện trắc nghiệm một cách hiệu quả. Dự án tập trung vào trải nghiệm người dùng mượt mà, giao diện tối (Dark Mode) cao cấp và logic xáo trộn câu hỏi thông minh.

**Các tính năng nổi bật:**
- **Permanent Dark Mode**: Giao diện tối chuyên nghiệp, bảo vệ mắt và tăng sự tập trung.
- **Xáo trộn đáp án**: Mỗi lần làm bài, thứ tự đáp án sẽ được thay đổi ngẫu nhiên nhưng vẫn đảm bảo tính ổn định trong suốt phiên làm bài.
- **Hệ thống gợi ý (Hints)**: Hỗ trợ học sinh khi gặp câu hỏi khó.
- **Báo cáo chi tiết**:
    - Theo dõi lịch sử làm bài, điểm số và tiến độ theo môn học.
    - **Sắp xếp lịch sử**: Sắp xếp bảng kết quả theo thời gian, điểm số,...
    - **Cảnh báo điểm thấp**: Tự động tô đỏ các bài làm có kết quả dưới 50%.
- **Quản lý nhóm & Cá nhân**: (Tính năng đang phát triển) Các mục quản lý thông tin người dùng và nhóm học tập.

## 🛠️ Công nghệ sử dụng
- **Frontend**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS, Material Symbols.
- **Router**: React Router DOM (v6).
- **State Management**: React Context API.
- **Backend (Dự kiến)**: Supabase (đã có schema sẵn sàng).

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0 trở lên.
- **NPM**: Phiên bản 9.0 trở lên.

### Các bước cài đặt
1. **Clone repository**:
   ```bash
   git clone https://github.com/Gatewi/quiz.git
   cd quiz
   ```

2. **Cài đặt dependencies**:
   ```bash
   cd petty-quiz-web
   npm install
   ```

3. **Chạy ứng dụng ở chế độ phát triển**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`.

4. **Build cho sản xuất**:
   ```bash
   npm run build
   ```

## 📖 Hướng dẫn sử dụng

### 1. Tạo bài kiểm tra
- Tại trang chủ, chọn **Trình độ** (ví dụ: Lớp 12) và **Môn học**.
- Chọn **Số lượng câu hỏi** bạn muốn thực hiện.
- Tích chọn một hoặc nhiều **Bài học** trong danh sách.
- Nhấn **Tạo bài kiểm tra** để bắt đầu.

### 2. Làm bài (Giao diện thi)
- Đọc câu hỏi và chọn đáp án đúng. Thứ tự đáp án sẽ được xáo trộn ngẫu nhiên.
- Nếu gặp khó khăn, hãy nhấn nút **Gợi ý** (Số lượng gợi ý có hạn).
- Sử dụng nút **Tiếp theo** hoặc **Quay lại** để điều hướng linh hoạt.
- Theo dõi **Thanh tiến độ** và **Đồng hồ bấm giờ** để quản lý thời gian.

### 3. Xem kết quả & Báo cáo
- Sau khi nhấn **Hoàn thành**, bạn sẽ được chuyển đến trang kết quả với điểm số và tỷ lệ phần trăm.
- Hệ thống sẽ liệt kê các câu trả lời sai kèm **Giải thích chi tiết**.
- Truy cập mục **Báo cáo** để:
    - Xem biểu đồ thống kê theo môn học.
    - Lọc lịch sử theo ngày tháng.
    - Sắp xếp bảng lịch sử làm bài.
    - Truy cập các tính năng **Quản lý nhóm** và **Thông tin cá nhân** (Đang xây dựng).

---
*Dự án được được phát triển để phục vụ mục đích giáo dục.*
