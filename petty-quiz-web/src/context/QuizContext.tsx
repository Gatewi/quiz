
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { QuizSession, QuizSettings } from '../types';
import { mockQuestions } from '../data/mock';
import { shuffleArray } from '../utils/shuffle';

interface QuizContextType {
    session: QuizSession | null;
    answers: Record<string, string>; // questionId -> optionId ("1", "2", "3", "4")
    currentQuestionIndex: number;
    timeLeft: number;
    startQuiz: (settings: QuizSettings) => void;
    submitAnswer: (questionId: string, optionId: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    decrementHints: () => void;
    finishQuiz: () => void;
    isFinished: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<QuizSession | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const finishQuiz = useCallback(() => {
        if (!session) return;

        let correct = 0;
        Object.entries(answers).forEach(([qId, selectedOption]) => {
            const q = mockQuestions.find(mq => mq.id_question === qId);
            if (q) {
                const correctOptions = q.correst_ans.split(',').map(s => s.trim());
                if (correctOptions.includes(selectedOption)) {
                    correct++;
                }
            }
        });

        setSession(prev => prev ? {
            ...prev,
            status: 'completed',
            correct_answers: correct,
            completed_at: new Date().toISOString()
        } : null);
        setIsFinished(true);
    }, [session, answers]);

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

    const startQuiz = (settings: QuizSettings) => {
        const totalQ = settings.question_count;
        const initialHints = Math.floor(totalQ / 10);

        // Prepare shuffled options for each question
        const filteredQuestions = mockQuestions.filter(q =>
            settings.lesson_ids.includes(q.id_lesson)
        ).slice(0, totalQ);

        const shuffledMap: Record<string, string[]> = {};
        filteredQuestions.forEach(q => {
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

        setSession(newSession);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeft(totalQ * 30);
        setIsFinished(false);
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
            isFinished
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
