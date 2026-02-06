import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { QuizSession, QuizSettings, Grade, Subject, Lesson, Question } from '../types';
import { supabase } from '../utils/supabase';
import { shuffleArray } from '../utils/shuffle';

interface QuizContextType {
    session: QuizSession | null;
    answers: Record<string, string>;
    currentQuestionIndex: number;
    timeLeft: number;
    startQuiz: (settings: QuizSettings) => Promise<void>;
    submitAnswer: (questionId: string, optionId: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    decrementHints: () => void;
    finishQuiz: () => void;
    isFinished: boolean;
    // Dynamic Data
    grades: Grade[];
    subjects: Subject[];
    lessons: Lesson[];
    questions: Question[]; // Session questions
    isLoading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<QuizSession | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Dynamic Data States
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [gradesRes, subjectsRes, lessonsRes] = await Promise.all([
                    supabase.from('grades').select('*'),
                    supabase.from('subjects').select('*'),
                    supabase.from('lessons').select('*')
                ]);

                if (gradesRes.data) setGrades(gradesRes.data);
                if (subjectsRes.data) setSubjects(subjectsRes.data);
                if (lessonsRes.data) setLessons(lessonsRes.data);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const finishQuiz = useCallback(async () => {
        if (!session) return;
        setIsLoading(true);

        try {
            let correct = 0;
            Object.entries(answers).forEach(([qId, selectedOption]) => {
                const q = questions.find(mq => mq.id_question === qId);
                if (q) {
                    const correctOptions = q.correst_ans.split(',').map(s => s.trim());
                    if (correctOptions.includes(selectedOption)) {
                        correct++;
                    }
                }
            });

            const completedSession: QuizSession = {
                ...session,
                status: 'completed',
                correct_answers: correct,
                completed_at: new Date().toISOString()
            };

            // Save to Supabase
            const { error } = await supabase
                .from('quiz_sessions')
                .upsert({
                    id: session.id,
                    id_user: session.id_user,
                    total_questions: session.total_questions,
                    correct_answers: correct,
                    time_elapsed_seconds: session.time_elapsed_seconds,
                    remaining_hints: session.remaining_hints,
                    status: 'completed',
                    quiz_settings: session.quiz_settings,
                    shuffled_options: session.shuffled_options,
                    completed_at: completedSession.completed_at
                });

            if (error) throw error;

            setSession(completedSession);
            setIsFinished(true);
        } catch (error) {
            console.error('Error finishing quiz:', error);
            alert('Có lỗi xảy ra khi lưu kết quả bài thi.');
        } finally {
            setIsLoading(false);
        }
    }, [session, answers, questions]);

    // Timer logic
    useEffect(() => {
        if (session && session.status === 'in-progress' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && session?.status === 'in-progress') {
            finishQuiz();
        }
    }, [session, timeLeft, finishQuiz]);

    const startQuiz = async (settings: QuizSettings) => {
        setIsLoading(true);
        try {
            const { data: fetchedQuestions, error } = await supabase
                .from('questions')
                .select('*')
                .in('id_lesson', settings.lesson_ids)
                .limit(settings.question_count);

            if (error) throw error;
            if (!fetchedQuestions || fetchedQuestions.length === 0) {
                alert('Không tìm thấy câu hỏi cho các bài học đã chọn.');
                return;
            }

            const totalQ = fetchedQuestions.length;
            const initialHints = Math.floor(totalQ / 10) || 1;

            const shuffledMap: Record<string, string[]> = {};
            (fetchedQuestions as Question[]).forEach((q: Question) => {
                shuffledMap[q.id_question] = shuffleArray(['1', '2', '3', '4']);
            });

            const newSession: QuizSession = {
                id: Math.random().toString(36).substr(2, 9),
                id_user: 'mock-user',
                total_questions: totalQ,
                correct_answers: 0,
                time_elapsed_seconds: 0,
                remaining_hints: initialHints,
                last_question_index: 0,
                status: 'in-progress',
                expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                quiz_settings: settings,
                started_at: new Date().toISOString(),
                shuffled_options: shuffledMap
            };

            setQuestions(fetchedQuestions);
            setSession(newSession);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setTimeLeft(totalQ * 60); // 60s per question
            setIsFinished(false);
        } catch (error) {
            console.error('Error starting quiz:', error);
            alert('Có lỗi xảy ra khi tải câu hỏi.');
        } finally {
            setIsLoading(false);
        }
    };

    const submitAnswer = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const nextQuestion = () => {
        if (session && currentQuestionIndex < session.total_questions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const decrementHints = () => {
        if (session && session.remaining_hints > 0) {
            setSession(prev => prev ? { ...prev, remaining_hints: prev.remaining_hints - 1 } : null);
        }
    };

    return (
        <QuizContext.Provider value={{
            session,
            answers,
            currentQuestionIndex,
            timeLeft,
            startQuiz,
            submitAnswer,
            nextQuestion,
            prevQuestion,
            decrementHints,
            finishQuiz,
            isFinished,
            grades,
            subjects,
            lessons,
            questions,
            isLoading
        }}>
            {children}
        </QuizContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) throw new Error('useQuiz must be used within a QuizProvider');
    return context;
};
