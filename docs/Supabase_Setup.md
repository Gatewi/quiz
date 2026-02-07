# Supabase Setup Guide

This guide details the steps to set up the Supabase backend for the PettyQuiz application.

## 1. Create a New Project
1.  Go to [Supabase Dashboard](https://supabase.com/dashboard).
2.  Click "New Project".
3.  Enter a Name (e.g., `PettyQuiz`) and Database Password.
4.  Choose a Region close to your users (e.g., Singapore).

## 2. Execute SQL Schema
Navigate to the **SQL Editor** in your Supabase dashboard and run the following script. This script creates all necessary tables (`profiles`, `grades`, `subjects`, `lessons`, `questions`, `quiz_sessions`, etc.) and sets up Row Level Security (RLS).

**Copy content from:** `supabase_schema.sql`

### Latest Updates (Detailed History)
If you already have the database set up, run this migration to add the `wrong_answers` column:

```sql
ALTER TABLE public.quiz_sessions 
ADD COLUMN wrong_answers jsonb; -- Stores array of wrong answer details
```

## 3. Seed Initial Data
To populate the database with initial categories (Grades 10-12, Subjects) and sample data, you can run the SQL commands found in `src/data/seed.sql` (if available) or manually insert data into `grades` and `subjects` tables.

*Example Seed:*
```sql
INSERT INTO grades (id_grade, grade_name) VALUES 
('g10', 'Lớp 10'), ('g11', 'Lớp 11'), ('g12', 'Lớp 12');

INSERT INTO subjects (id_subject, subject_name) VALUES 
('math', 'Toán'), ('phys', 'Vật lý'), ('chem', 'Hóa học'), ('eng', 'Tiếng Anh');
```

## 4. Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Authentication Settings
1.  Go to **Authentication** -> **Providers**.
2.  Enable **Email/Password**.
3.  (Optional) Enable **Google** and configure Client ID/Secret.
4.  Disable "Confirm email" in **Authentication** -> **URL Configuration** if you want instant login for testing.

## 6. Storage (Optional)
If you plan to use user avatars:
1.  Go to **Storage**.
2.  Create a new public bucket named `avatars`.
3.  Add policy to allow authenticated users to upload/select.

## 7. Extensions
The schema uses `pgcrypto` or `uuid-ossp` for UUID generation. Ensure these extensions are enabled in **Database** -> **Extensions**.
