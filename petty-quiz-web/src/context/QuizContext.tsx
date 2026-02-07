import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { QuizSession, QuizSettings, Grade, Subject, Lesson, Question } from '../types';
import { supabase } from '../utils/supabase';
import { shuffleArray } from '../utils/shuffle';
import { mockUserProfile, MOCK_USER_ID } from '../data/mock';
import { useAuth } from './AuthContext';

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
    resetQuiz: () => void;
    loadSession: (session: QuizSession) => void;
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
    const { user } = useAuth();
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

        let correct = 0;
        const wrongAnswersList: any[] = [];
        Object.entries(answers).forEach(([qId, selectedOption]) => {
            const q = questions.find(mq => mq.id_question.toString() === qId);
            if (q) {
                const correctOptions = q.correst_ans.split(',').map(s => s.trim());
                if (correctOptions.includes(selectedOption)) {
                    correct++;
                } else {
                    // Collect wrong answer details
                    wrongAnswersList.push({
                        question: q,
                        selected_answer: selectedOption,
                        correct_answer: q.correst_ans
                    });
                }
            }
        });

        const completedSession: QuizSession = {
            ...session,
            status: 'completed',
            correct_answers: correct,
            completed_at: new Date().toISOString(),
            wrong_answers: wrongAnswersList
        };

        // Skip DB save ONLY if it is the MOCK user ID (i.e. user not logged in)
        if (session.id_user === MOCK_USER_ID) {
            console.warn('Mock user - skipping save');
            setSession(completedSession);
            setIsFinished(true);
            setIsLoading(false);
            return;
        }

        try {
            // Save to Supabase
            // Removing 'id' to let DB generate it (Identity column or UUID)
            const { error } = await supabase
                .from('quiz_sessions')
                .insert({
                    id_user: session.id_user,
                    total_questions: session.total_questions,
                    correct_answers: correct,
                    time_elapsed_seconds: session.time_elapsed_seconds,
                    remaining_hints: session.remaining_hints,
                    status: 'completed',
                    quiz_settings: session.quiz_settings,
                    shuffled_options: session.shuffled_options,
                    completed_at: completedSession.completed_at,
                    wrong_answers: wrongAnswersList
                });

            if (error) throw error;

            setSession(completedSession);
            setIsFinished(true);
        } catch (error: any) {
            console.error('Error finishing quiz:', error);

            // Handle FK violation (missing profile)
            if (error.code === '23503' && user) {
                console.log('Profile missing. Attempting to create profile and retry...');
                try {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{
                            id_user: user.id,
                            user_email: user.email,
                            user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                            is_active: true,
                            user_role: 'student'
                        }]);

                    if (!profileError) {
                        // Retry saving quiz result
                        const { error: retryError } = await supabase
                            .from('quiz_sessions')
                            .insert({
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

                        if (!retryError) {
                            setSession(completedSession);
                            setIsFinished(true);
                            return; // Success on retry
                        }
                    } else {
                        console.error('Failed to create profile on recovery:', profileError);
                    }
                } catch (retryErr) {
                    console.error('Error during self-healing:', retryErr);
                }
            }

            alert('Có lỗi xảy ra khi lưu kết quả bài thi: ' + (error.message || JSON.stringify(error)));
        } finally {
            setIsLoading(false);
        }
    }, [session, answers, questions, user]);

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
            // 1. Fetch ALL valid questions for the selected lessons (no limit)
            const { data: allQuestionsData, error } = await supabase
                .from('questions')
                .select('*')
                .in('id_lesson', settings.lesson_ids);

            if (error) throw error;

            if (!allQuestionsData || allQuestionsData.length === 0) {
                alert('Không tìm thấy câu hỏi cho các bài học đã chọn.');
                setIsLoading(false);
                return;
            }

            // 2. Algorithm: Ensure at least one question per lesson (if available) + Random fill
            const questionsByLesson: Record<string, Question[]> = {};
            // Initialize groups
            settings.lesson_ids.forEach(lId => {
                questionsByLesson[lId] = [];
            });

            // Categorize questions
            (allQuestionsData as Question[]).forEach(q => {
                // Only consider questions belonging to requested lessons (double check)
                if (questionsByLesson[q.id_lesson]) {
                    questionsByLesson[q.id_lesson].push(q);
                }
            });

            let finalSelection: Question[] = [];
            let remainingPool: Question[] = [];

            // Step 2a: Pick one random question from each lesson group first
            Object.values(questionsByLesson).forEach(lessonQs => {
                if (lessonQs.length > 0) {
                    const shuffledLessonQs = shuffleArray(lessonQs);
                    // Add the first one to guarantee coverage
                    finalSelection.push(shuffledLessonQs[0]);
                    // Add the rest to the general pool
                    for (let i = 1; i < shuffledLessonQs.length; i++) {
                        remainingPool.push(shuffledLessonQs[i]);
                    }
                }
            });

            // Step 2b: Fill the remaining quota from the pool
            const questionsNeeded = settings.question_count - finalSelection.length;
            if (questionsNeeded > 0) {
                // Shuffle pool for randomness
                const shuffledPool = shuffleArray(remainingPool);
                // Take needed amount (or all if not enough)
                const additional = shuffledPool.slice(0, questionsNeeded);
                finalSelection = [...finalSelection, ...additional];
            } else if (questionsNeeded < 0) {
                // Case: User asked for fewer questions than selected lessons
                // Randomly trim the forced selection to match count
                finalSelection = shuffleArray(finalSelection).slice(0, settings.question_count);
            }

            // Step 2c: Final Shuffle (Requirement 3: Random order)
            // Ensure the final list is not sorted by lesson
            const selectedQuestions = shuffleArray(finalSelection);

            const totalQ = selectedQuestions.length;
            if (totalQ === 0) {
                alert('Không đủ câu hỏi để tạo bài thi (Số lượng: 0).');
                setIsLoading(false);
                return;
            }

            // 3. Create Session
            const initialHints = Math.floor(totalQ / 10) || 1;

            const shuffledMap: Record<string, string[]> = {};
            selectedQuestions.forEach((q: Question) => {
                shuffledMap[q.id_question] = shuffleArray(['1', '2', '3', '4']);
            });

            // Use real user ID if logged in, otherwise use MOCK_USER_ID
            const userId = user?.id || MOCK_USER_ID;

            const newSession: QuizSession = {
                id: Math.floor(Math.random() * 1000000), // Updated to integer ID logic temporarily or fix schema mismatch later
                id_user: userId, // Use the valid UUID const
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

            // Important: Set questions state to the randomized list
            setQuestions(selectedQuestions);
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

    const resetQuiz = useCallback(() => {
        setSession(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeft(0);
        setIsFinished(false);
        setQuestions([]);
    }, []);

    const loadSession = useCallback((historySession: QuizSession) => {
        setSession(historySession);

        // Populate state from correct/wrong answers logic
        // Since we only store wrong answers, we can reconstruct a partial state
        // Questions array will contain only the wrong questions
        if (historySession.wrong_answers && Array.isArray(historySession.wrong_answers)) {
            const restoredQuestions = historySession.wrong_answers.map((w: any) => w.question);
            const restoredAnswers: Record<string, string> = {};
            historySession.wrong_answers.forEach((w: any) => {
                restoredAnswers[w.question.id_question.toString()] = w.selected_answer;
            });

            setQuestions(restoredQuestions);
            setAnswers(restoredAnswers);
        } else {
            // Fallback for old sessions without detailed history
            setQuestions([]);
            setAnswers({});
        }

        setIsFinished(true); // Treat as finished
    }, []);

    return (
        <QuizContext.Provider value={{
            session,
            answers,
            currentQuestionIndex,
            timeLeft,
            startQuiz,
            resetQuiz,
            loadSession,
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
