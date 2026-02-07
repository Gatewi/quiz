import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';


const ExamResult: React.FC = () => {
    const { session, answers, questions, resetQuiz } = useQuiz();
    const navigate = useNavigate();

    const handleNewExam = () => {
        resetQuiz();
        navigate('/');
    };

    if (!session || session.status !== 'completed') {
        return (
            <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white min-h-screen flex flex-col items-center justify-center font-display">
                <p className="text-xl">Không tìm thấy kết quả bài thi.</p>
                <Link to="/" className="mt-4 text-primary hover:underline">Quay về trang chủ</Link>
            </div>
        );
    }

    const percentage = Math.round((session.correct_answers / session.total_questions) * 100);

    const getAnswerContent = (q: any, optionId: string) => {
        if (optionId === '1') return q.answer_1;
        if (optionId === '2') return q.answer_2;
        if (optionId === '3') return q.answer_3;
        if (optionId === '4') return q.answer_4;
        return '';
    };

    // Find wrong answers (Only if questions are available)
    const wrongAnswers = questions.length > 0 ? Object.entries(answers).map(([qId, oId]) => {
        // Fix: Convert ID to string for comparison
        const q = questions.find(mq => mq.id_question.toString() === qId);
        if (!q) return null;

        const correctOptions = q.correst_ans.split(',').map(s => s.trim());
        const isCorrect = correctOptions.includes(oId);

        if (isCorrect) return null;

        return {
            id_question: q.id_question,
            question_name: q.question_name,
            selected_content: getAnswerContent(q, oId),
            correct_content: correctOptions.map(id => getAnswerContent(q, id)).join(', '),
            explanation: q.hint,
            isCorrect
        };
    }).filter(Boolean) : [];

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white min-h-screen flex flex-col font-display">
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#282e39] bg-white dark:bg-[#111318] px-4 md:px-10 py-3">
                <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-[32px]">school</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PettyQuiz</h2>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-9">
                        <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Trang chủ</Link>
                        <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors" to="/report">Báo cáo</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center w-full px-4 py-8 md:py-12">
                <div className="w-full max-w-[800px] flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold leading-tight">Kết quả bài thi</h1>
                            <p className="text-[#637588] dark:text-[#9da6b9] text-lg">Hoàn thành lúc {session.completed_at ? new Date(session.completed_at).toLocaleTimeString() : ''}, {session.completed_at ? new Date(session.completed_at).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-4 p-8 rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-transparent items-center justify-center text-center h-full shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-sm font-bold text-[#637588] dark:text-[#9da6b9] uppercase tracking-wider">Kết quả</span>
                                    <h3 className="text-4xl md:text-5xl font-bold text-[#111318] dark:text-white">
                                        <span className={percentage >= 50 ? "text-green-500" : "text-red-500"}>{session.correct_answers}</span>/{session.total_questions}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-transparent items-center justify-center text-center h-full shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-sm font-bold text-[#637588] dark:text-[#9da6b9] uppercase tracking-wider">Tỷ lệ đúng</span>
                                    <h3 className="text-4xl md:text-5xl font-bold text-[#111318] dark:text-white">{percentage}%</h3>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
                            <Link className="flex-1 flex items-center justify-center h-12 rounded-lg border border-[#e5e7eb] dark:border-[#3b4354] bg-transparent text-[#111318] dark:text-white hover:bg-gray-100 dark:hover:bg-[#3b4354] font-bold transition-all gap-2 group" to="/report">
                                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">bar_chart</span>
                                Xem báo cáo
                            </Link>
                            <button
                                onClick={handleNewExam}
                                className="flex-1 flex items-center justify-center h-12 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/25 transition-all gap-2 group cursor-pointer"
                            >
                                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform">refresh</span>
                                Làm bài mới
                            </button>
                        </div>
                    </div>
                    {/* Wrong Answers List */}
                    {questions.length === 0 ? (
                        session.correct_answers === session.total_questions ? (
                            <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-xl text-center flex flex-col items-center gap-3">
                                <div className="size-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-2">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">emoji_events</span>
                                </div>
                                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Xuất sắc!</h3>
                                <p className="text-green-600 dark:text-green-300">Bạn đã trả lời đúng tất cả các câu hỏi. Tuyệt vời!</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center text-yellow-500">
                                Không có dữ liệu chi tiết câu hỏi cho bài thi này (bài thi cũ).
                            </div>
                        )
                    ) : wrongAnswers.length > 0 && (
                        <div className="flex flex-col gap-6 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-red-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-[#111318] dark:text-white">Danh sách câu trả lời sai ({wrongAnswers.length})</h3>
                            </div>
                            {wrongAnswers.map((wa: any, idx) => (
                                <div key={idx} className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-transparent overflow-hidden">
                                    <div className="p-6 border-b border-[#e5e7eb] dark:border-[#3b4354]">
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="flex items-center justify-center size-7 rounded bg-gray-100 dark:bg-[#3b4354] text-xs font-bold text-[#637588] dark:text-[#9da6b9] shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                                            <h4 className="text-base md:text-lg font-medium text-[#111318] dark:text-white leading-relaxed">
                                                {wa?.question_name}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center p-3 rounded-lg border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 gap-3">
                                                <span className="material-symbols-outlined text-red-500 shrink-0">cancel</span>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-xs text-red-500 font-bold uppercase mb-0.5">Bạn chọn</span>
                                                    <span className="dark:text-white">{wa?.selected_content || "Bỏ trống"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 rounded-lg border border-green-500/30 bg-green-500/5 dark:bg-green-500/10 gap-3">
                                                <span className="material-symbols-outlined text-green-500 shrink-0">check_circle</span>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-xs text-green-500 font-bold uppercase mb-0.5">Đáp án đúng</span>
                                                    <span className="dark:text-white">{wa?.correct_content}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-[#1a1c23] flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
                                        <p className="text-sm text-[#637588] dark:text-[#9da6b9] italic leading-relaxed">
                                            <span className="font-bold text-primary not-italic mr-1">Giải thích:</span> {wa?.explanation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExamResult;
