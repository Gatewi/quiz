import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const ExamInterface: React.FC = () => {
    const navigate = useNavigate();
    const {
        session,
        answers,
        currentQuestionIndex,
        timeLeft,
        submitAnswer,
        nextQuestion,
        prevQuestion,
        decrementHints,
        finishQuiz,
        isFinished,
        questions
    } = useQuiz();

    const [showHintModal, setShowHintModal] = useState(false);

    // Redirect if no session
    useEffect(() => {
        if (!session && !isFinished) {
            navigate('/');
        }
    }, [session, isFinished, navigate]);

    useEffect(() => {
        if (isFinished) {
            navigate('/exam-result');
        }
    }, [isFinished, navigate]);

    if (!session || questions.length === 0) return null;

    const currentQ = questions[currentQuestionIndex];

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = Math.round(((currentQuestionIndex + 1) / session.total_questions) * 100);

    const onUseHint = () => {
        if (session.remaining_hints > 0) {
            decrementHints();
            setShowHintModal(true);
        }
    };

    // Get answer content based on option ID (original 1, 2, 3, 4)
    const getAnswerContent = (q: any, id: string) => {
        if (id === '1') return q.answer_1;
        if (id === '2') return q.answer_2;
        if (id === '3') return q.answer_3;
        if (id === '4') return q.answer_4;
        return '';
    };

    // Use shuffled order from session if available, otherwise default to 1,2,3,4
    const optionIds = session.shuffled_options?.[currentQ.id_question] || ['1', '2', '3', '4'];
    const options = optionIds.map(id => ({ id, content: getAnswerContent(currentQ, id) }));

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white font-display flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Hint Modal */}
            {showHintModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-surface-dark border border-border-dark p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-4 text-yellow-500">
                            <span className="material-symbols-outlined text-3xl">lightbulb</span>
                            <h3 className="text-xl font-bold text-white">Gợi ý trả lời</h3>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-6 italic">
                            "{currentQ?.hint || "Không có gợi ý cụ thể cho câu hỏi này."}"
                        </p>
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            <div className="layout-container flex h-full grow flex-col w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <header className="flex justify-end w-full mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark border border-border-dark">
                        <span className="material-symbols-outlined text-gray-400 text-lg">school</span>
                        <span className="text-sm font-medium text-gray-300">
                            {session.quiz_settings.id_subject.toUpperCase()} - {session.quiz_settings.id_grade.toUpperCase()}
                        </span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-8">
                    <section className="w-full bg-surface-dark/50 rounded-xl p-5 border border-border-dark backdrop-blur-sm">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-end text-sm text-gray-400 mb-1">
                                <span className="font-medium text-white">Tiến độ làm bài</span>
                                <span className="font-bold text-primary text-base">{progress}%</span>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">timer</span>
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative overflow-hidden" style={{ width: `${progress}%` }}>
                                    <div className="absolute inset-0 bg-white/20 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8 max-w-[800px] mx-auto w-full">
                        {currentQ ? (
                            <>
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-primary text-lg font-bold tracking-wide uppercase opacity-90">
                                        Câu hỏi số {currentQuestionIndex + 1}/{session.total_questions}:
                                    </h2>
                                    <p className="text-white text-2xl sm:text-3xl font-medium leading-tight">
                                        {currentQ.question_name}
                                    </p>
                                </div>

                                <div className="radio-custom flex flex-col gap-4 mt-2">
                                    {options.map((option) => (
                                        <label key={option.id} className={`group relative flex items-center gap-4 rounded-xl border border-border-dark bg-surface-dark p-5 cursor-pointer transition-all hover:border-primary/50 hover:bg-surface-dark/80 ${answers[currentQ.id_question] === option.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : ''}`}>
                                            <div className="flex items-center justify-center shrink-0">
                                                <input
                                                    type="radio"
                                                    name="quiz-option"
                                                    className="peer h-5 w-5 border-2 border-gray-500 bg-transparent text-transparent checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-all"
                                                    checked={answers[currentQ.id_question] === option.id}
                                                    onChange={() => submitAnswer(currentQ.id_question.toString(), option.id)}
                                                />
                                            </div>
                                            <div className="flex grow flex-col">
                                                <span className="text-white text-lg font-normal leading-normal group-hover:text-white transition-colors">{option.content}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <p className="text-text-secondary">Đang tải câu hỏi...</p>
                            </div>
                        )}
                    </section>
                </main>

                <footer className="mt-12 py-6 border-t border-border-dark">
                    <div className="max-w-[800px] mx-auto w-full grid grid-cols-3 items-center gap-4">
                        <div className="justify-self-start">
                            <button
                                className="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-surface-dark transition-colors font-medium disabled:opacity-20"
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                <span>Quay lại</span>
                            </button>
                        </div>
                        <div className="justify-self-center">
                            <button
                                className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-dark hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all disabled:opacity-20"
                                onClick={onUseHint}
                                disabled={session.remaining_hints === 0}
                            >
                                <span className="material-symbols-outlined text-yellow-500 group-hover:animate-pulse">lightbulb</span>
                                <span className="text-gray-300 group-hover:text-yellow-200">Gợi ý</span>
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-dark border border-border-dark text-[10px] font-bold text-gray-400 group-hover:text-yellow-500 group-hover:border-yellow-500/50">
                                    {session.remaining_hints}
                                </span>
                            </button>
                        </div>
                        <div className="justify-self-end">
                            {currentQuestionIndex === session.total_questions - 1 ? (
                                <button
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
                                    onClick={finishQuiz}
                                >
                                    <span>Hoàn thành</span>
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:translate-x-1 active:translate-x-0"
                                    onClick={nextQuestion}
                                >
                                    <span>Tiếp theo</span>
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default ExamInterface;

