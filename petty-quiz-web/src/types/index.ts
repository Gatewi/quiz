
export type GradeId = string;
export type SubjectId = string;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UserRole = 'admin' | 'student' | 'teacher';
export type QuizStatus = 'in-progress' | 'completed' | 'expired';

export interface Profile {
    id_user: string;
    user_name: string;
    user_email: string;
    user_pass?: string; // Optional for frontend safety
    is_verified: boolean;
    is_active: boolean;
    user_role: UserRole;
    user_msg: string | null;
    xp_points: number;
    created_at: string;
}

export interface Grade {
    id_grade: GradeId;
    grade_name: string;
    grade_node?: string;
}

export interface Subject {
    id_subject: SubjectId;
    subject_name: string;
    subject_node?: string;
}

export interface Lesson {
    id_lesson: string;
    id_subject: SubjectId;
    id_grade: GradeId;
    lesson_name: string;
    lesson_type1?: string;
    lesson_type2?: string;
    lesson_active: boolean;
    order_index: number;
}

export interface Question {
    id_question: number;
    id_subject: SubjectId;
    id_lesson: string;
    question_name: string;
    answer_1: string;
    answer_2: string;
    answer_3: string;
    answer_4: string;
    correst_ans: string; // e.g. "1" or "1,2"
    hint: string;
    difficulty: Difficulty;
    created_at: string;
}

export interface QuizSettings {
    id_grade: GradeId;
    id_subject: SubjectId;
    lesson_ids: string[];
    question_count: number;
}

export interface QuizSession {
    id: number;
    id_user: string; // UUID
    total_questions: number;
    correct_answers: number;
    time_elapsed_seconds: number;
    remaining_hints: number;
    last_question_index: number;
    status: QuizStatus;
    expiration_date: string;
    quiz_settings: QuizSettings;
    started_at: string;
    completed_at?: string;
    shuffled_options?: Record<string, string[]>; // questionId -> list of option IDs ["2", "4", "1", "3"]
    wrong_answers?: any[]; // Array of { question: Question, selectedAnswer: string, correctAnswer: string }
}

export interface SessionAnswer {
    id: string;
    session_id: number;
    id_question: number;
    selected_answer: string; // "1", "2", "3", "4"
    is_correct: boolean;
    answered_at: string;
}

export interface QuestionAnswer {
    id_qa: number;
    qa_question: string;
    qa_answer: string;
    sort: number;
    created_at: string;
}
