
-- 1. Profiles Table (extends Supabase Auth)
create table public.profiles (
  id_user uuid references auth.users not null primary key,
  user_name text not null,
  user_email text not null,
  is_verified boolean default false,
  is_active boolean default true,
  user_role text default 'student',
  user_msg text,
  xp_points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Grades Table
create table public.grades (
  id_grade text primary key,
  grade_name text not null,
  grade_node text
);

-- 3. Subjects Table
create table public.subjects (
  id_subject text primary key,
  subject_name text not null,
  slug text not null,
  color_theme text,
  icon_name text,
  subject_node text
);

-- 4. Lessons Table
create table public.lessons (
  id_lesson uuid default gen_random_uuid() primary key,
  id_subject text references public.subjects(id_subject) not null,
  id_grade text references public.grades(id_grade) not null,
  lesson_name text not null,
  lesson_type1 text,
  lesson_type2 text,
  order_index integer default 0
);

-- 5. Questions Table (FLATTENED STRUCTURE)
create table public.questions (
  id_question uuid default gen_random_uuid() primary key,
  id_subject text references public.subjects(id_subject) not null,
  id_lesson uuid references public.lessons(id_lesson) on delete cascade not null,
  question_name text not null,
  answer_1 text not null,
  answer_2 text not null,
  answer_3 text not null,
  answer_4 text not null,
  correst_ans text not null, -- e.g. "1" or "1,2"
  hint text,
  difficulty text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Quiz Sessions (Tracks a user taking a quiz)
create table public.quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  id_user uuid references public.profiles(id_user) not null,
  total_questions integer not null default 0,
  correct_answers integer default 0,
  time_elapsed_seconds integer default 0,
  remaining_hints integer default 0,
  last_question_index integer default 0,
  status text default 'in-progress' check (status in ('in-progress', 'completed', 'expired')),
  expiration_date timestamp with time zone,
  quiz_settings jsonb not null, -- Stores id_grade, id_subject, lesson_ids
  shuffled_options jsonb, -- Stores questionId -> list of option IDs ["2", "4", "1", "3"]
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- 7. Session Answers (Tracks individual answers in a session)
create table public.session_answers (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.quiz_sessions(id) on delete cascade not null,
  id_question uuid references public.questions(id_question) not null,
  selected_answer text, -- "1", "2", "3", "4"
  is_correct boolean default false,
  answered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Profiles
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id_user);

-- Grades/Subjects/Lessons (Read-only for public)
alter table public.grades enable row level security;
create policy "Grades are viewable by everyone." on grades for select using (true);

alter table public.subjects enable row level security;
create policy "Subjects are viewable by everyone." on subjects for select using (true);

alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone." on lessons for select using (true);

-- Questions
alter table public.questions enable row level security;
create policy "Questions are viewable by everyone." on questions for select using (true);

-- Quiz Sessions
alter table public.quiz_sessions enable row level security;
create policy "Users can view own sessions." on quiz_sessions for select using (auth.uid() = id_user);
create policy "Users can insert own sessions." on quiz_sessions for insert with check (auth.uid() = id_user);
create policy "Users can update own sessions." on quiz_sessions for update using (auth.uid() = id_user);

-- Session Answers
alter table public.session_answers enable row level security;
create policy "Users can view own answers." on session_answers for select using (
  exists ( select 1 from quiz_sessions where id = session_answers.session_id and id_user = auth.uid() )
);
create policy "Users can insert own answers." on session_answers for insert with check (
  exists ( select 1 from quiz_sessions where id = session_answers.session_id and id_user = auth.uid() )
);
