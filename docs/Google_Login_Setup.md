# Hướng dẫn Cấu hình Đăng nhập Google (Google OAuth)

Lỗi bạn gặp phải (`Unsupported provider: provider is not enabled`) là do **Google Authentication chưa được kích hoạt** trên Supabase Dashboard.

Để khắc phục, bạn cần thực hiện 2 phần chính:
1.  Tạo **OAuth Client ID** trên Google Cloud Console.
2.  Nhập thông tin vào Supabase Authentication Settings.

---

## Phần 1: Tạo OAuth Client ID trên Google Cloud

1.  Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2.  Tạo một Project mới (hoặc chọn Project có sẵn).
3.  Tìm kiếm **"APIs & Services"** -> **"OAuth consent screen"**.
    *   Chọn **External**.
    *   Điền tên ứng dụng (VD: PettyQuiz), email hỗ trợ.
    *   Nhấn **Save and Continue**.
4.  Vào menu **Credentials** -> **Create Credentials** -> **OAuth client ID**.
    *   Application type: **Web application**.
    *   Name: `PettyQuiz Web Client`.
    *   **Authorized JavaScript origins**:
        *   `http://localhost:5178` (link chạy local của bạn)
        *   `https://<project-ref>.supabase.co` (URL Supabase của bạn)
    *   **Authorized redirect URIs**:
        *   `https://<project-ref>.supabase.co/auth/v1/callback`
        *   *(Lưu ý: Thay `<project-ref>` bằng ID dự án Supabase của bạn, lấy trong Settings -> API)*.
5.  Nhấn **Create**.
6.  Copy **Client ID** và **Client Secret**.

---

## Phần 2: Kích hoạt Google Provider trên Supabase

1.  Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2.  Chọn Project của bạn.
3.  Vào menu **Authentication** (icon hình người) -> **Providers**.
4.  Chọn **Google**.
5.  Gạt nút **Enable Google** sang trạng thái **Bật**.
6.  Dán **Client ID** và **Client Secret** bạn vừa copy ở Phần 1 vào.
7.  Nhấn **Save**.

---

## Phần 3: Kiểm tra lại URL Redirect (Quan trọng)

Đảm bảo trong code `Login.tsx`, phần `redirectTo` trỏ đúng về trang chủ của bạn:

```typescript
options: {
    redirectTo: `${window.location.origin}/` 
}
```

Nếu bạn đang chạy local, nó sẽ là `http://localhost:5178/`.
Đảm bảo bạn đã thêm URL này vào **Authentication -> URL Configuration -> Redirect URLs** trong Supabase Dashboard.
