# Thiết kế cơ sở dữ liệu Supabase - PettyQuiz (Updated)

Tài liệu này mô tả chi tiết cấu trúc cơ sở dữ liệu (Database Design) được cập nhật dựa trên `data_structure_base.txt`, tối ưu hóa cho Supabase và đáp ứng đầy đủ các tính năng của website.

## 1. Sơ đồ thực thể (ERD)

```mermaid
erDiagram
    PROFILES ||--o{ QUIZ_SESSIONS : "thực hiện"
    GRADES ||--o{ LESSONS : "phân loại"
    SUBJECTS ||--o{ LESSONS : "thuộc"
    LESSONS ||--o{ QUESTIONS : "chứa"
    QUIZ_SESSIONS ||--o{ SESSION_ANSWERS : "ghi nhận"
    QUESTIONS ||--o{ SESSION_ANSWERS : "được trả lời"

    PROFILES {
        uuid id_user PK "auth.users"
        string user_name "Full name"
        string user_email
        string user_pass "Hashed password"
        boolean is_verified "Email verified status"
        boolean is_active "Mặc định true"
        string user_role "admin, teacher, student"
        text user_msg "Thông báo riêng cho user"
        int xp_points "Mặc định 0"
        timestamp created_at
    }

    GRADES {
        uuid id_grade PK
        string grade_name "Lớp 10, 11, 12, v.v."
        text grade_node "Ghi chú"
    }

    SUBJECTS {
        uuid id_subject PK
        string subject_name "Toán, Lý, Hóa..."
        string slug "URL-friendly"
        string color_theme "Mã màu Hex"
        string icon_name "Material Icon name"
        text subject_node "Ghi chú"
    }

    LESSONS {
        uuid id_lesson PK
        uuid id_subject FK
        uuid id_grade FK
        string lesson_name "Tên bài học"
        string lesson_type1 "Dự phòng"
        string lesson_type2 "Dự phòng"
        int order_index "Thứ tự hiển thị"
    }

    QUESTIONS {
        uuid id_question PK
        uuid id_subject FK
        uuid id_lesson FK
        text question_name "Nội dung câu hỏi (LaTeX/Markdown)"
        text answer_1 "Lựa chọn 1"
        text answer_2 "Lựa chọn 2"
        text answer_3 "Lựa chọn 3"
        text answer_4 "Lựa chọn 4"
        string correst_ans "Đáp án đúng (vd: '1' hoặc '1,3')"
        text hint "Gợi ý / Giải thích"
        enum difficulty "easy, medium, hard"
        timestamp created_at
    }

    QUIZ_SESSIONS {
        uuid id PK
        uuid id_user FK
        int total_questions
        int correct_answers
        int time_elapsed_seconds
        int remaining_hints
        int last_question_index
        enum status "in-progress, completed, expired"
        timestamp expiration_date
        jsonb quiz_settings "Lưu vết: môn học, lớp, danh sách bài học"
        timestamp started_at
        timestamp completed_at
    }

    SESSION_ANSWERS {
        uuid id PK
        uuid session_id FK
        uuid id_question FK
        string selected_answer "Vị trí chọn: '1', '2', '3', '4'"
        boolean is_correct
        timestamp answered_at
    }
```

## 2. Chi tiết các bảng & Quy tắc logic

### 2.1. Quản lý Người dùng (`profiles`)
- **`user_role`**: Phân quyền truy cập. `admin` có quyền quản lý nội dung, `teacher` tạo câu hỏi, `student` làm bài.
- **`user_msg`**: Hệ thống sẽ hiển thị một Pop-up thông báo ngay sau khi người dùng đăng nhập thành công nếu trường này không trống.
- **`is_active`**: Cơ chế khóa tài khoản tức thì từ phía quản trị.

### 2.2. Tổ chức Nội dung (`grades`, `subjects`, `lessons`)
- Đảm bảo tính phân cấp rõ ràng: Một bài học (`lesson`) thuộc về một môn học (`subject`) và một khối lớp (`grade`).
- Các trường `lesson_type` để mở rộng cho các loại bài học khác nhau (Lý thuyết, Thực hành, Ôn tập).

### 2.3. Cấu trúc Câu hỏi Flat (`questions`)
- Thay vì sử dụng bảng `options` riêng biệt, phiên bản này sử dụng 4 trường `answer_1-4` để đơn giản hóa việc nạp dữ liệu câu hỏi từ Excel/CSV.
- **`correst_ans`**: Hỗ trợ nhiều đáp án đúng nếu giá trị chứa dấu phẩy (vd: `1,4`). Logic frontend/backend sẽ tách chuỗi này để kiểm tra.

### 2.4. Phiên làm bài & Tự động lưu (`quiz_sessions`)
- **Cơ chế Auto-save**: Mọi hành động chọn đáp án sẽ được lưu vào `SESSION_ANSWERS` và cập nhật `last_question_index` trong `quiz_sessions`.
- **Logic Hint**: Số lượt gợi ý khởi tạo = `total_questions / 10`.

## 3. Bảo mật & Tối ưu hóa
- **RLS**: Phân quyền dựa trên `user_id` và `user_role`.
- **Indexes**: Đánh index cho `id_user`, `id_subject`, `id_lesson` và `status` của quiz session.
