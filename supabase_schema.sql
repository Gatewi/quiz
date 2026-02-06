
-- 1. Profiles Table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  xp_points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Quizzes Table
create type subject_enum as enum ('math', 'literature', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography');
create type grade_enum as enum ('10', '11', '12');

create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  subject subject_enum not null,
  grade grade_enum not null,
  duration_minutes integer not null default 45,
  total_questions integer not null default 0,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Questions Table
create type difficulty_enum as enum ('easy', 'medium', 'hard');

create table public.questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  content text not null, -- The question text
  difficulty difficulty_enum default 'medium',
  explanation text, -- Explanation for the correct answer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Options Table
create table public.options (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references public.questions(id) on delete cascade not null,
  content text not null,
  is_correct boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Quiz Attempts (Tracks a user taking a quiz)
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  quiz_id uuid references public.quizzes(id) not null,
  score integer, -- Number of correct answers
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  status text default 'in-progress' check (status in ('in-progress', 'completed'))
);

-- 6. Quiz Answers (Tracks individual answers in an attempt)
create table public.quiz_answers (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references public.quiz_attempts(id) on delete cascade not null,
  question_id uuid references public.questions(id) not null,
  selected_option_id uuid references public.options(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies (Draft)

-- Profiles: Public read, User update own
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Quizzes: Public read if published
alter table public.quizzes enable row level security;
create policy "Published quizzes are viewable by everyone." on quizzes for select using (is_published = true);

-- Questions/Options: Read if quiz is visible
alter table public.questions enable row level security;
create policy "Questions viewable if quiz is published" on questions for select using (
  exists ( select 1 from quizzes where id = questions.quiz_id and is_published = true )
);

alter table public.options enable row level security;
create policy "Options viewable if quiz is published" on options for select using (
  exists ( select 1 from questions join quizzes on questions.quiz_id = quizzes.id 
           where questions.id = options.question_id and quizzes.is_published = true )
);

-- Quiz Attempts: User can CRUD own attempts
alter table public.quiz_attempts enable row level security;
create policy "Users can view own attempts." on quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts." on quiz_attempts for insert with check (auth.uid() = user_id);
create policy "Users can update own attempts." on quiz_attempts for update using (auth.uid() = user_id);
