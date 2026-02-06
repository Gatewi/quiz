# Hướng dẫn chạy Supabase Local (Docker)

Bạn hoàn toàn có thể chạy Supabase cục bộ trên máy tính của mình để phát triển nhanh hơn, tiết kiệm chi phí và không cần kết nối internet.

## 1. Yêu cầu hệ thống
- **Docker Desktop**: Cần được cài đặt và đang chạy ([Tải tại đây](https://www.docker.com/products/docker-desktop/)).
- **Supabase CLI**: Công cụ dòng lệnh của Supabase.

### Cài đặt Supabase CLI

#### Windows (Sử dụng Scoop - Khuyên dùng)
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### macOS (Sử dụng Homebrew)
```bash
brew install supabase/tap/supabase
```

#### Linux (Sử dụng NPM - Toàn hệ thống)
```bash
npm install supabase --save-dev
```
*Hoặc cài đặt global:*
```bash
npm install -g supabase
```

#### Cài đặt thủ công (Binary)
Bạn có thể tải trực tiếp file thực thi từ trang [Releases của Supabase CLI](https://github.com/supabase/cli/releases).


## 2. Khởi tạo Local Project
1. Mở Terminal tại thư mục gốc dự án (`quiz/`).
2. Khởi tạo cấu hình Supabase:
   ```bash
   npx supabase init
   ```
3. Khởi động các dịch vụ Supabase (Docker phải đang chạy):
   ```bash
   npx supabase start
   ```
   *Lưu ý: Lần đầu chạy sẽ mất vài phút để tải các Docker Images.*

## 3. Thông tin kết nối Local
Sau khi lệnh `start` hoàn tất, bạn sẽ nhận được các thông tin sau:
- **API URL**: `http://127.0.0.1:54321`
- **Anon Key**: `eyJh......` (Chuỗi ký tự dài)
- **Studio URL**: `http://127.0.0.1:54323` (Giao diện quản lý giống trên web)

## 4. Áp dụng Database Schema
Thay vì dán vào SQL Editor thủ công, bạn có thể đẩy schema vào DB local:
```bash
npx supabase db reset
```
*Hoặc dán nội dung [supabase_schema.sql](file:///c:/setup/Antigravity/quiz/supabase_schema.sql) vào SQL Editor tại `http://127.0.0.1:54323`.*

## 5. Cập nhật Biến môi trường
Cập nhật tệp `petty-quiz-web/.env` để trỏ về máy local:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

## 6. Ưu điểm và Lưu ý
- **Tốc độ**: Truy vấn cực nhanh vì chạy ngay trên máy.
- **Offline**: Làm việc không cần mạng.
- **Database Migrations**: Bạn có thể quản lý lịch sửa đổi code DB chuyên nghiệp hơn.
- **Docker**: Luôn đảm bảo Docker Desktop đang chạy trước khi gõ `supabase start`.

Để dừng Supabase local:
```bash
npx supabase stop
```
