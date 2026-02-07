# Các Lỗi Thường Gặp & Cách Khắc Phục (Troubleshooting)

## 1. Lỗi Đăng Ký: "email rate limit exceeded"

**Nguyên nhân:**
- Supabase giới hạn số lượng email xác nhận gửi đi trong một khoảng thời gian ngắn (để chống spam).
- Bạn đang gửi quá nhiều yêu cầu đăng ký liên tục.

**Cách khắc phục (Đề xuất cho môi trường Dev):**
1.  Truy cập **Supabase Dashboard** -> [Project của bạn].
2.  Vào menu **Authentication** (icon hình người) -> **Providers**.
3.  Chọn **Email**.
4.  Tìm và **Tắt (Disable)** mục **"Enable Email Confirmations"** (hoặc "Confirm email").
5.  Nhấn **Save**.

Sau khi làm xong, bạn có thể **Đăng ký lại** với một email mới ngay lập tức mà không cần xác nhận qua email.

---

## 2. Lỗi Google Login: "Unsupported provider: provider is not enabled"

**Nguyên nhân:**
- Chưa bật Google Provider trong Supabase Authentication.

**Cách khắc phục:**
- Xem hướng dẫn chi tiết tại `docs/Google_Login_Setup.md`.
- Cần lấy **Client ID** & **Client Secret** từ Google Cloud Console.

---

## 3. Lỗi Đăng Ký thành công nhưng không đăng nhập được ngay (nếu vẫn bật Confirm Email)

**Nguyên nhân:**
- Tài khoản ở trạng thái "Waiting for Verification".
- Bạn cần mở email và bấm vào link xác nhận.

**Giải pháp:**
- Tắt "Confirm Email" như hướng dẫn ở mục 1 để bỏ qua bước này.
