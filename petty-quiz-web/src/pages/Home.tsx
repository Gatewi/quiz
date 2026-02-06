
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { mockGrades, mockSubjects, mockLessons, mockUserProfile } from '../data/mock';
import type { GradeId, SubjectId } from '../types';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { startQuiz } = useQuiz();

    // States aligned with new schema
    const [selectedGradeId, setSelectedGradeId] = useState<GradeId | ''>('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | ''>('');
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
    const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);

    // Filtered lessons based on grade and subject
    const filteredLessons = mockLessons.filter(lesson =>
        (selectedGradeId === '' || lesson.id_grade === selectedGradeId) &&
        (selectedSubjectId === '' || lesson.id_subject === selectedSubjectId)
    );

    // Check for user message on "login"
    useEffect(() => {
        if (mockUserProfile.user_msg) {
            const timer = setTimeout(() => setShowWelcomeMsg(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const lessonsCount = selectedLessonIds.length;
    const quantity = parseInt(selectedQuantity) || 0;
    const time = Math.round(quantity * 0.5);
    const isCreateEnabled = selectedGradeId !== '' && selectedSubjectId !== '' && selectedQuantity !== '' && lessonsCount > 0;

    const handleToggleLesson = (id: string) => {
        setSelectedLessonIds(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLessonIds(filteredLessons.map(l => l.id_lesson));
        } else {
            setSelectedLessonIds([]);
        }
    };

    const handleCreateQuiz = () => {
        if (!isCreateEnabled) return;

        startQuiz({
            id_grade: selectedGradeId as GradeId,
            id_subject: selectedSubjectId as SubjectId,
            lesson_ids: selectedLessonIds,
            question_count: quantity
        });
        navigate('/exam');
    };

    const currentGrade = mockGrades.find(g => g.id_grade === selectedGradeId);
    const currentSubject = mockSubjects.find(s => s.id_subject === selectedSubjectId);

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
            {/* User Message Modal */}
            {showWelcomeMsg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-surface-dark border border-border-dark p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <span className="material-symbols-outlined text-3xl">notifications_active</span>
                            <h3 className="text-xl font-bold text-white">Thông báo mới</h3>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            {mockUserProfile.user_msg}
                        </p>
                        <button
                            onClick={() => setShowWelcomeMsg(false)}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            <section className="flex flex-col md:flex-row md:items-end gap-4 pb-4 border-b border-border-dark/50">
                <div className="flex flex-col md:flex-row md:items-baseline w-full gap-4 md:gap-8">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight shrink-0">Chào mừng bạn!</h2>
                    <p className="text-text-secondary text-base font-normal">Hãy chọn các tham số bên dưới để bắt đầu tạo bài kiểm tra của bạn.</p>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary group-focus-within:text-primary">
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                    <select
                        className="w-full h-14 pl-5 pr-10 bg-surface-dark border border-border-dark rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer font-medium hover:bg-surface-darker"
                        value={selectedGradeId}
                        onChange={(e) => {
                            setSelectedGradeId(e.target.value as GradeId);
                            setSelectedLessonIds([]); // Reset lessons on change
                        }}
                    >
                        <option value="">Chọn trình độ</option>
                        {mockGrades.map(grade => (
                            <option key={grade.id_grade} value={grade.id_grade}>{grade.grade_name}</option>
                        ))}
                    </select>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary group-focus-within:text-primary">
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                    <select
                        className="w-full h-14 pl-5 pr-10 bg-surface-dark border border-border-dark rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer font-medium hover:bg-surface-darker"
                        value={selectedSubjectId}
                        onChange={(e) => {
                            setSelectedSubjectId(e.target.value as SubjectId);
                            setSelectedLessonIds([]); // Reset lessons on change
                        }}
                    >
                        <option value="">Chọn môn học</option>
                        {mockSubjects.map(subject => (
                            <option key={subject.id_subject} value={subject.id_subject}>{subject.subject_name}</option>
                        ))}
                    </select>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary group-focus-within:text-primary">
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                    <select
                        className="w-full h-14 pl-5 pr-10 bg-surface-dark border border-border-dark rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer font-medium hover:bg-surface-darker"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                    >
                        <option value="">Chọn số câu hỏi</option>
                        <option value="10">10 câu</option>
                        <option value="20">20 câu</option>
                        <option value="50">50 câu</option>
                        <option value="100">100 câu</option>
                    </select>
                </div>
            </section>

            <section className="flex flex-col lg:flex-row gap-8 h-full min-h-[400px]">
                <div className="flex-1 flex flex-col bg-surface-dark rounded-2xl border border-border-dark overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-border-dark bg-surface-darker flex items-center justify-between sticky top-0 z-10">
                        <span className="font-semibold text-white">Danh sách bài học</span>
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                            <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">Chọn tất cả các bài học</span>
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer size-5 rounded border-2 border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 transition-all checked:border-primary"
                                    checked={filteredLessons.length > 0 && selectedLessonIds.length === filteredLessons.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </div>
                        </label>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 max-h-[500px]">
                        {filteredLessons.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {filteredLessons.map((lesson) => (
                                    <label key={lesson.id_lesson} className="flex items-center gap-4 px-4 py-4 rounded-lg bg-surface-darker/30 hover:bg-surface-darker/50 cursor-pointer border border-transparent hover:border-border-dark/50 transition-all group select-none">
                                        <input
                                            type="checkbox"
                                            className="lesson-checkbox size-5 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0"
                                            checked={selectedLessonIds.includes(lesson.id_lesson)}
                                            onChange={() => handleToggleLesson(lesson.id_lesson)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{lesson.lesson_name}</span>
                                            <span className="text-xs text-text-secondary">{lesson.lesson_type1 || 'Đã học 10%'}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-text-secondary">
                                <span className="material-symbols-outlined text-5xl mb-2 opacity-20">inventory_2</span>
                                <p>Vui lòng chọn trình độ và môn học để xem bài học</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-6 pt-2">
                    <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col items-start gap-4 shadow-lg">
                        <button
                            className={`w-full h-16 bg-primary hover:bg-primary-hover text-white text-xl font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${!isCreateEnabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                            disabled={!isCreateEnabled}
                            onClick={handleCreateQuiz}
                        >
                            <span>Tạo bài kiểm tra</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <div className="w-full h-px bg-border-dark my-1"></div>
                        <div className="flex flex-col gap-4 w-full">
                            <p className="text-sm font-medium text-text-secondary">Bạn đã chọn:</p>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">subject</span>
                                <span className="text-white font-medium">
                                    Môn học: <span className="text-primary font-bold">{currentSubject ? `${currentSubject.subject_name} / ${currentGrade?.grade_name || ''}` : 'Chưa chọn'}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                                <span className="text-white font-medium">
                                    Số bài học: <span className="text-primary font-bold">{lessonsCount}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">library_books</span>
                                <span className="text-white font-medium">
                                    Số câu hỏi: <span className="text-primary font-bold">{quantity > 0 ? quantity : 'Chưa chọn'}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">timer</span>
                                <span className="text-white font-medium">
                                    Thời gian dự kiến: <span className="text-primary font-bold">{quantity > 0 ? `${time} phút` : '0 phút'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-surface-dark to-surface-darker p-5 rounded-2xl border border-border-dark/50 flex gap-4 items-start">
                        <span className="material-symbols-outlined text-yellow-500 mt-0.5">lightbulb</span>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            <strong className="text-white block mb-1">Mẹo nhỏ:</strong>
                            Chọn nhiều bài học cùng lúc để tạo bài kiểm tra tổng hợp kiến thức hiệu quả hơn.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
