# Hướng dẫn thiết lập Supabase cho PettyQuiz

Tài liệu này hướng dẫn bạn cách khởi tạo Database trên Supabase và kết nối với ứng dụng PettyQuizWeb.

## 1. Lựa chọn môi trường phát triển
Bạn có thể chọn một trong hai cách sau:
- **Cloud (Khuyên dùng)**: Dễ thiết lập, truy cập được từ mọi nơi. Xem hướng dẫn bên dưới.
- **Local (Docker)**: Chạy trên máy cá nhân, nhanh và offline. Xem [Hướng dẫn Supabase Local](file:///c:/setup/Antigravity/quiz/docs/Local_Supabase_Setup.md).

## 2. Tạo Project trên Supabase Cloud

## 2. Khởi tạo Database Schema
1. Trong Dashboard Supabase, chọn mục **SQL Editor** (icon `>_` ở thanh bên trái).
2. Nhấn **New Query**.
3. Mở tệp [supabase_schema.sql](file:///c:/setup/Antigravity/quiz/supabase_schema.sql) trong thư mục gốc của dự án.
4. Sao chép toàn bộ nội dung tệp SQL và dán vào SQL Editor trên trình duyệt.
5. Nhấn **Run**.
6. Kiểm tra mục **Table Editor** để đảm bảo các bảng (`profiles`, `grades`, `subjects`, `lessons`, `questions`, ...) đã được tạo thành công.

## 3. Cấu hình xác thực (Authentication)
1. Vào mục **Authentication** -> **Providers**.
2. Đảm bảo **Email** đã được bật (mặc định).
3. (Tùy chọn) Bật **Google** provider nếu bạn muốn sử dụng đăng nhập bằng Google.
4. Vào **Authentication** -> **URL Configuration** và gán `Site URL` là địa chỉ website của bạn (ví dụ: `http://localhost:5173`).

## 4. Kết nối Frontend với Supabase

### Bước 1: Cài đặt SDK
Mở terminal trong thư mục `petty-quiz-web` và chạy:
```bash
npm install @supabase/supabase-js
```

### Bước 2: Cấu hình biến môi trường
Tạo tệp `.env` trong thư mục `petty-quiz-web/` (nếu chưa có) và thêm các thông tin từ mục **Project Settings** -> **API**:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Bước 3: Khởi tạo Client
Tạo tệp `src/utils/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 5. Bảo mật với Row Level Security (RLS)
Các chính sách bảo mật đã được bao gồm trong tệp `supabase_schema.sql`. 
- **Profiles**: Người dùng chỉ có thể sửa thông tin của chính mình.
- **Quizzes/Questions**: Mọi người có thể đọc để làm bài.
- **Quiz Sessions**: Người dùng chỉ có thể xem/tạo/cập nhật phiên làm bài của chính họ.

---
*Lưu ý: Sau khi hoàn tất, bạn có thể thay thế các dữ liệu Mock trong `src/data/mock.ts` bằng logic gọi API từ `supabase` client.*
