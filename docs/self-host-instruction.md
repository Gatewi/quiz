# Hướng dẫn Cài đặt & Triển khai (All-in-One)

Dưới đây là danh sách các lệnh chi tiết để bạn có thể copy & paste và chạy lần lượt trên server Ubuntu mới.

**Thông tin:**
- Domain: `tuhoc.fimi.vn`
- Thư mục code: `/home/fimi/web`
- Thư mục web (Deploy): `/var/www/petty-quiz-web`

---

## 1. Cài đặt Môi trường & Tools
Chạy lần lượt các lệnh sau để cài Node.js v20, Nginx và Git.

```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt Nginx, Git, Unzip
sudo apt install nginx git unzip -y

# 3. Cài đặt Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Kiểm tra cài đặt
node -v
npm -v
nginx -v

# 5. Mở Firewall (Port 80, 443)
sudo ufw allow 'Nginx Full'
# Nếu chưa bật ufw thì bật lên (lưu ý cần allow ssh trước nếu chưa làm)
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 2. Tải Code & Build
Các bước này thực hiện dưới user thường (ví dụ `fimi`).

```bash
# 1. Quay về thư mục Home
cd ~

# 2. Clone source code (đổi tên thành web)
git clone https://github.com/Gatewi/quiz.git web

# 3. Vào thư mục dự án web
cd ~/web/petty-quiz-web

# 4. Cài đặt thư viện
npm install

# 5. Tạo file môi trường (Thay thế URL Supabase của bạn vào đây)
cat <<EOF > .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
# (Lưu ý: Hãy sửa lại file .env bằng lệnh: nano .env sau khi chạy lệnh trên nếu cần)

# 6. Build dự án
npm run build
```

---

## 3. Deploy (Copy ra /var/www)
Bước này đưa code đã build ra thư mục chuẩn của web server để tránh lỗi quyền hạn (Lỗi 500/403).

```bash
# 1. Tạo thư mục đích
sudo mkdir -p /var/www/petty-quiz-web

# 2. Copy toàn bộ code trong thư mục dist vừa build sang
sudo cp -r ~/web/petty-quiz-web/dist/* /var/www/petty-quiz-web/

# 3. Phân quyền cho Nginx (user www-data) sở hữu thư mục này
sudo chown -R www-data:www-data /var/www/petty-quiz-web
sudo chmod -R 755 /var/www/petty-quiz-web
```

---

## 4. Cấu hình Nginx
Tạo file cấu hình và kích hoạt nó.

```bash
# 1. Tạo file cấu hình mới
sudo nano /etc/nginx/sites-available/petty-quiz
```

**Dán nội dung sau vào file `nano` vừa mở:**
*(Dùng chuột phải để Paste, sau đó bấm `Ctrl+O` -> `Enter` để lưu, `Ctrl+X` để thoát)*

```nginx
server {
    listen 80;
    server_name tuhoc.fimi.vn;

    root /var/www/petty-quiz-web;
    index index.html;

    # Cấu hình log (tuỳ chọn, giúp debug dễ hơn)
    error_log /var/log/nginx/petty-quiz-error.log;
    access_log /var/log/nginx/petty-quiz-access.log;

    # SPA Routing (Quan trọng)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache file tĩnh
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

**Tiếp tục chạy các lệnh sau:**

```bash
# 2. Kích hoạt site (tạo symlink)
sudo ln -sf /etc/nginx/sites-available/petty-quiz /etc/nginx/sites-enabled/

# 3. Kiểm tra cấu hình xem có lỗi không
sudo nginx -t

# 4. Khởi động lại Nginx
sudo systemctl restart nginx
```

---

## 5. Cài SSL (HTTPS)
Tự động cài đặt HTTPS với Certbot.

```bash
# 1. Cài Certbot
sudo apt install certbot python3-certbot-nginx -y

# 2. Lấy chứng chỉ (Làm theo hướng dẫn trên màn hình, nhập email và đồng ý điều khoản)
sudo certbot --nginx -d tuhoc.fimi.vn
```

---

## 6. Cập nhật Code mới (Khi có thay đổi)
Mỗi khi bạn đẩy code mới lên GitHub, hãy chạy các lệnh sau để cập nhật server:

```bash
# 1. Pull code mới
cd ~/web
git pull origin main

# 2. Build lại
cd ~/web/petty-quiz-web
npm install
npm run build

# 3. Deploy lại (Copy đè sang /var/www)
sudo cp -r dist/* /var/www/petty-quiz-web/
sudo chown -R www-data:www-data /var/www/petty-quiz-web
```
