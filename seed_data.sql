-- Seed Data for PettyQuiz
-- Run this in your Supabase SQL Editor to populate initial data

-- 1. Insert Grades
INSERT INTO public.grades (id_grade, grade_name, grade_node) VALUES
('g10', 'Lớp 10', 'Chương trình phổ thông lớp 10'),
('g11', 'Lớp 11', 'Chương trình phổ thông lớp 11'),
('g12', 'Lớp 12', 'Chương trình phổ thông lớp 12')
ON CONFLICT (id_grade) DO NOTHING;

-- 2. Insert Subjects
INSERT INTO public.subjects (id_subject, subject_name, slug, color_theme, icon_name) VALUES
('s1', 'Toán học', 'toan-hoc', '#135bec', 'calculate'),
('s2', 'Ngữ văn', 'ngu-van', '#e11d48', 'menu_book'),
('s3', 'Tiếng Anh', 'tieng-anh', '#0ea5e9', 'translate'),
('s4', 'Vật lý', 'vat-ly', '#8b5cf6', 'bolt'),
('s5', 'Hóa học', 'hoa-hoc', '#10b981', 'science')
ON CONFLICT (id_subject) DO NOTHING;

-- 3. Insert Lessons (Using Text IDs)
INSERT INTO public.lessons (id_lesson, id_subject, id_grade, lesson_name, order_index) VALUES
('l_g12_s1_c1', 's1', 'g12', 'Chương 1: Khối đa diện', 1),
('l_g12_s1_c2', 's1', 'g12', 'Chương 2: Mặt nón, mặt trụ, mặt cầu', 2),
('l_g12_s3_u1', 's3', 'g12', 'Unit 1: Life Stories', 1),
('l_g12_s3_u2', 's3', 'g12', 'Unit 2: Urbanisation', 2)
ON CONFLICT (id_lesson) DO NOTHING;

-- 4. Insert Questions (Updated with new Lesson IDs)
INSERT INTO public.questions (id_subject, id_lesson, question_name, answer_1, answer_2, answer_3, answer_4, correst_ans, hint, difficulty) VALUES
('s3', 'l_g12_s3_u1', 'Which of the following is a synonym for ''happy'' in the context of professional achievement?', 'Content', 'Fulfilled', 'Amused', 'Lucky', '2', '''Fulfilled'' thường mô tả cảm giác thỏa mãn và hạnh phúc đạt được khi thực hiện được mục tiêu hoặc tiềm năng trong sự nghiệp.', 'medium'),
('s3', 'l_g12_s3_u1', 'What is the past participle of the verb ''to choose''?', 'Choosed', 'Chosen', 'Choosen', 'Chose', '2', 'Động từ ''choose'' là bất quy tắc: choose (hiện tại), chose (quá khứ), chosen (quá khứ phân từ).', 'easy'),
('s3', 'l_g12_s3_u1', 'Which sentence is grammatically correct?', 'They has been waiting for hours.', 'They have been waiting for hours.', 'They was waiting for hours.', 'They been waiting for hours.', '2', 'Cấu trúc đúng sử dụng ''have been'' cho thì hiện tại hoàn thành tiếp diễn với chủ ngữ số nhiều.', 'medium'),
('s3', 'l_g12_s3_u1', 'What does the idiom ''break the ice'' mean?', 'To freeze something', 'To relieve tension or start a conversation', 'To cause an accident', 'To speak loudly', '2', '''Break the ice'' nghĩa là làm hoặc nói điều gì đó để làm giảm căng thẳng hoặc bắt đầu một cuộc trò chuyện.', 'easy'),
('s3', 'l_g12_s3_u1', 'Choose the correct preposition: She is interested ___ learning new languages.', 'at', 'in', 'on', 'for', '2', '''Interested in'' là cụm từ đi kèm cố định trong tiếng Anh.', 'easy'),
('s3', 'l_g12_s3_u2', 'What is the opposite of ''urbanisation''?', 'Industrialisation', 'Ruralization', 'Modernisation', 'Globalisation', '2', 'Ngược lại với đô thị hóa (urbanisation - di chuyển đến thành phố) là nông thôn hóa (ruralization - di chuyển khỏi thành phố).', 'medium'),
('s3', 'l_g12_s3_u2', 'Which word is a verb?', 'Development', 'Developing', 'Develop', 'Developed', '3', '''Develop'' là động từ, trong khi các từ khác là danh từ hoặc tính từ/phân từ.', 'easy'),
('s3', 'l_g12_s3_u2', 'Complete the sentence: The city ___ a lot in the last decade.', 'change', 'changed', 'has changed', 'is changing', '3', 'Thì hiện tại hoàn thành ''has changed'' được dùng cho những thay đổi bắt đầu trong quá khứ và có liên quan đến hiện tại.', 'medium'),
('s3', 'l_g12_s3_u2', 'What is a ''megacity''?', 'A city with over 1 million people', 'A city with over 10 million people', 'A capital city', 'A coastal city', '2', 'Một siêu đô thị (megacity) thường được định nghĩa là thành phố có dân số vượt quá 10 triệu người.', 'medium'),
('s3', 'l_g12_s3_u2', 'Which word means ''crowded and dirty living conditions''?', 'Suburb', 'Slum', 'Downtown', 'Village', '2', '''Slum'' (khu ổ chuột) dùng để chỉ các khu vực đô thị đông đúc, bẩn thỉu với điều kiện nhà ở và sinh hoạt kém.', 'hard');

-- 5. Insert Questions and Answers (Guide)
INSERT INTO public.questions_answers (qa_question, qa_answer, sort) VALUES
('Làm thế nào để tạo một bài kiểm tra mới?', 'Bạn có thể tạo bài kiểm tra mới bằng cách chọn trình độ, môn học và số lượng câu hỏi trên trang chủ, sau đó chọn các chương bài tập và nhấn ''Tạo bài kiểm tra''.', 1),
('Tôi có thể chia sẻ bài quiz với người khác không?', 'Có. Sau khi hoàn tất bài kiểm tra, bạn nhấn vào nút ''Chia sẻ''. Hệ thống sẽ cung cấp cho bạn một đường link trực tiếp hoặc mã QR để bạn gửi cho học sinh hoặc người tham gia.', 2),
('Làm sao để xem lại lịch sử làm bài?', 'Truy cập vào mục ''Báo cáo'' trên thanh điều hướng. Tại đây, bạn sẽ thấy danh sách tất cả các bài kiểm tra đã tham gia cùng với điểm số chi tiết và thời gian hoàn thành.', 3),
('PettyQuiz có miễn phí không?', 'PettyQuiz cung cấp gói miễn phí với đầy đủ các tính năng cơ bản để tạo và tham gia bài kiểm tra. Tuy nhiên, các tính năng Pro sẽ sớm được ra mắt.', 4),
('Tôi quên mật khẩu thì phải làm sao?', 'Tại màn hình đăng nhập, vui lòng chọn liên kết "Quên mật khẩu". Hệ thống sẽ yêu cầu bạn nhập địa chỉ email đã đăng ký để gửi hướng dẫn đặt lại mật khẩu mới.', 5);
