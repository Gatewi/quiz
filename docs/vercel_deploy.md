# Hướng dẫn Deploy PettyQuiz lên Vercel

Vercel là nền tảng tốt nhất để deploy các ứng dụng React + Vite. Vì dự án này có cấu trúc thư mục con (`petty-quiz-web`), bạn cần lưu ý một số cấu hình quan trọng.

## 1. Chuẩn bị
- Đảm bảo mã nguồn mới nhất đã được push lên GitHub.
- Tài khoản [Vercel](https://vercel.com/) (có thể đăng nhập bằng GitHub).

## 2. Các bước triển khai

### Bước 1: Import Project
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard).
2. Nhấn **Add New** -> **Project**.
3. Tìm repository `quiz` của bạn và nhấn **Import**.

### Bước 2: Cấu hình Project (QUAN TRỌNG)
Trong màn hình "Configure Project", hãy thiết lập như sau:

1. **Root Directory**: Nhấn **Edit** và chọn thư mục `petty-quiz-web`. Đây là nơi chứa mã nguồn React.
2. **Framework Preset**: Vercel sẽ tự động nhận diện là **Vite**.
3. **Build and Output Settings**: Giữ mặc định.

### Bước 3: Cài đặt Biến môi trường (Environment Variables)
Mở phần **Environment Variables** và thêm các biến cần thiết từ Supabase:

- **Key**: `VITE_SUPABASE_URL`
- **Value**: (Copy từ tệp `.env` hoặc Supabase Dashboard)

Nhấn **Add**, sau đó lặp lại với:

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: (Copy từ tệp `.env` hoặc Supabase Dashboard)

### Bước 4: Deploy
- Nhấn **Deploy**.
- Vercel sẽ tiến hành cài đặt dependencies, build ứng dụng và cung cấp cho bạn một tên miền (URL) chính thức sau khoảng 1-2 phút.

## 3. Cấu hình Single Page Application (SPA)
Vite sử dụng React Router để điều hướng trang. Để tránh lỗi 404 khi bạn tải lại trang hoặc truy cập trực tiếp các đường dẫn (như `/exam`, `/report`), bạn cần cấu hình Vercel để luôn trỏ về `index.html`.

Tạo tệp `petty-quiz-web/vercel.json` (nếu Vercel không tự cấu hình):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 4. Quản lý cập nhật
Sau khi deploy thành công:
- Bất cứ khi nào bạn **Git Push** lên nhánh `main`, Vercel sẽ tự động build và cập nhật phiên bản mới nhất cho định website của bạn.
- Bạn có thể tùy chỉnh tên miền riêng (Custom Domain) trong mục **Settings** -> **Domains**.

## 5. Hướng dẫn kiểm tra lỗi (Debug) trên Vercel

Nếu website không cập nhật hoặc gặp lỗi, hãy làm theo các bước sau để tìm nguyên nhân:

### Bước 1: Kiểm tra trạng thái Deployment
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard).
2. Chọn dự án **quiz** (hoặc tên dự án bạn đã đặt).
3. Chuyển sang tab **Deployments**.
4. Bạn sẽ thấy danh sách các lần deploy.
    - **Ready** (Xanh lá): Đã deploy thành công.
    - **Building** (Xanh dương): Đang trong quá trình xử lý.
    - **Error** (Đỏ): Gặp lỗi trong quá trình Build.

### Bước 2: Xem chi tiết lỗi (Build Logs)
Nếu trạng thái là **Error**, hãy:
1. Nhấn vào dòng deployment bị lỗi.
2. Màn hình sẽ hiện ra chi tiết các bước (Building, Assigning Domains...).
3. Nhấn vào mục **Building** (thường có màu đỏ).
4. Cuộn xuống khung bên phải để đọc **Log**.
    - Tìm các dòng có chữ `Error` hoặc màu đỏ.
    - Ví dụ phổ biến: `Module not found`, `TypeScript error`, `Command failed`.

### Bước 3: Xem lỗi Runtime (Website trắng trang/lỗi 500)
Nếu deploy thành công (Ready) nhưng vào web bị lỗi:
1. Trên trang chủ dự án Vercel, chọn tab **Logs**.
2. Tại đây sẽ hiển thị các log thực thi khi người dùng truy cập web.
3. F5 lại trang web bị lỗi, sau đó quay lại tab Logs để xem thông báo lỗi mới nhất xuất hiện.

## 6. Xử lý sự cố thường gặp
### Website không cập nhật sau khi Push?
1. **Kiểm tra trạng thái Build**: Như Bước 1 ở trên.
2. **Xóa Cache trình duyệt**: Nhấn `Ctrl + F5` (Windows) hoặc `Cmd + Shift + R` (Mac).
3. **Kiểm tra nhánh**: Đảm bảo code đã lên nhánh `main`.

### Lỗi 404 khi load lại trang con?
- Đảm bảo file `vercel.json` đã tồn tại trong thư mục `petty-quiz-web` với cấu hình rewrites đúng.

---
*Chúc mừng! Ứng dụng của bạn hiện đã trực tuyến và sẵn sàng cho người dùng.*
