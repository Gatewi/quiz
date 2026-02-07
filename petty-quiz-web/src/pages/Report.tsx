import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import type { QuizSession } from '../types';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';

const Report: React.FC = () => {
    const { user, profile } = useAuth();
    const { loadSession } = useQuiz();
    const navigate = useNavigate();

    const [history, setHistory] = useState<QuizSession[]>([]);
    const [subjectsMap, setSubjectsMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'report' | 'groups' | 'profile'>('report');

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'started_at', direction: 'desc' });

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // Default Date Range: Last 7 days
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                // Fetch Subjects
                const { data: subjectsData } = await supabase.from('subjects').select('id_subject, subject_name');
                const sMap: Record<string, string> = {};
                if (subjectsData) {
                    subjectsData.forEach((s: any) => {
                        sMap[s.id_subject] = s.subject_name;
                    });
                }
                setSubjectsMap(sMap);

                // Fetch History
                let query = supabase
                    .from('quiz_sessions')
                    .select('*')
                    .eq('id_user', user.id)
                    .order('started_at', { ascending: false });

                // Apply Date Filter
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0); // Start of day
                    query = query.gte('started_at', start.toISOString());
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999); // End of day
                    query = query.lte('started_at', end.toISOString());
                }

                const { data, error } = await query;

                if (error) throw error;
                if (data) setHistory(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, startDate, endDate]);

    const handleReview = (session: QuizSession) => {
        loadSession(session);
        navigate('/exam-result');
    };

    const sortedHistory = [...history].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aValue: any = a[key as keyof QuizSession];
        let bValue: any = b[key as keyof QuizSession];

        // Handle nested or calculated values
        if (key === 'subject_name') {
            aValue = subjectsMap[a.quiz_settings?.id_subject] || '';
            bValue = subjectsMap[b.quiz_settings?.id_subject] || '';
        } else if (key === 'score') {
            aValue = a.status === 'completed' ? (a.correct_answers || 0) : -1;
            bValue = b.status === 'completed' ? (b.correct_answers || 0) : -1;
        } else if (key === 'ratio') {
            aValue = a.status === 'completed' ? ((a.correct_answers || 0) / a.total_questions) : -1;
            bValue = b.status === 'completed' ? ((b.correct_answers || 0) / b.total_questions) : -1;
        } else if (key === 'started_at') {
            aValue = new Date(a.started_at).getTime();
            bValue = new Date(b.started_at).getTime();
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <span className="material-symbols-outlined text-[16px] text-text-secondary/30">unfold_more</span>;
        return sortConfig.direction === 'asc'
            ? <span className="material-symbols-outlined text-[16px] text-primary">arrow_upward</span>
            : <span className="material-symbols-outlined text-[16px] text-primary">arrow_downward</span>;
    };

    // Stats Calculation
    const completedQuizzes = history.filter(s => s.status === 'completed');
    const totalSubjects = new Set(history.map(s => s.quiz_settings.id_subject)).size;
    const totalCorrectAnswers = completedQuizzes.reduce((acc, s) => acc + (s.correct_answers || 0), 0);
    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((acc, s) => acc + (s.correct_answers / s.total_questions), 0) / completedQuizzes.length * 100)
        : 0;

    // Subject breakdown
    const subjectStats = Array.from(new Set(history.map(s => s.quiz_settings.id_subject))).map(subId => {
        const subQuizzes = completedQuizzes.filter(s => s.quiz_settings.id_subject === subId);
        const subAvg = subQuizzes.length > 0
            ? Math.round(subQuizzes.reduce((acc, s) => acc + (s.correct_answers / s.total_questions), 0) / subQuizzes.length * 100)
            : 0;
        const subCorrect = subQuizzes.reduce((acc, s) => acc + (s.correct_answers || 0), 0);
        return {
            id: subId,
            name: subjectsMap[subId] || subId.toUpperCase(),
            pct: subAvg,
            count: subQuizzes.length,
            totalCorrect: subCorrect
        };
    }).sort((a, b) => b.pct - a.pct);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                <Link to="/login" className="text-primary hover:underline">Vui lòng đăng nhập để xem báo cáo</Link>
            </div>
        );
    }

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'groups': return 'Quản lý nhóm';
            case 'profile': return 'Thông tin cá nhân';
            default: return 'Báo cáo kết quả';
        }
    };

    const getHeaderDescription = () => {
        switch (activeTab) {
            case 'groups': return 'Quản lý các nhóm học tập và thành viên';
            case 'profile': return 'Quản lý thông tin tài khoản và cài đặt cá nhân';
            default: return 'Theo dõi tiến độ và lịch sử làm bài của bạn';
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full flex-row bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#111318] border-r border-[#282e39] h-full shrink-0">
                <div className="flex flex-col h-full justify-between p-4">
                    <div className="flex flex-col gap-6">
                        {/* User Profile */}
                        <div className="flex gap-3 items-center px-2">
                            <div className="bg-primary/20 flex items-center justify-center rounded-full size-10 shrink-0 border border-primary/30">
                                <span className="material-symbols-outlined text-primary">person</span>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-white text-base font-medium leading-normal truncate">{profile?.user_name || user.email}</h1>
                                <p className="text-text-secondary text-xs font-normal leading-normal">User Reports</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('report')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${activeTab === 'report' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-[#282e39]'}`}
                            >
                                <span className={`material-symbols-outlined ${activeTab === 'report' ? 'text-primary' : 'text-text-secondary'}`} style={{ fontSize: '24px' }}>bar_chart</span>
                                <p className={`${activeTab === 'report' ? 'text-primary' : 'text-text-secondary'} text-sm font-medium leading-normal`}>Báo cáo</p>
                            </button>
                            <button
                                onClick={() => setActiveTab('groups')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${activeTab === 'groups' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-[#282e39]'}`}
                            >
                                <span className={`material-symbols-outlined ${activeTab === 'groups' ? 'text-primary' : 'text-text-secondary'}`} style={{ fontSize: '24px' }}>groups</span>
                                <p className={`${activeTab === 'groups' ? 'text-primary' : 'text-text-secondary'} text-sm font-medium leading-normal`}>Quản lý nhóm</p>
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${activeTab === 'profile' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-[#282e39]'}`}
                            >
                                <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'text-primary' : 'text-text-secondary'}`} style={{ fontSize: '24px' }}>person</span>
                                <p className={`${activeTab === 'profile' ? 'text-primary' : 'text-text-secondary'} text-sm font-medium leading-normal`}>Thông tin cá nhân</p>
                            </button>
                        </nav>
                    </div>
                    <div className="px-2">
                        <p className="text-[#4b5563] text-xs text-center">PettyQuiz Portal v2.2</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header Section */}
                <header className="w-full bg-[#111318] border-b border-[#282e39] p-6 shrink-0 z-10">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-center">
                        <div className="xl:col-span-1">
                            <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                                {getHeaderTitle()}
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">
                                {getHeaderDescription()}
                            </p>
                        </div>

                        {/* Date Filter Controls (Only for Report) - Centered in 2nd column */}
                        <div className="xl:col-span-1 flex justify-center">
                            {activeTab === 'report' && (
                                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-secondary text-sm">Từ:</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-[#282e39] text-white border border-[#3b4354] rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-secondary text-sm">Đến:</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-[#282e39] text-white border border-[#3b4354] rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Empty 3rd column for balance */}
                        <div className="xl:col-span-1"></div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth custom-scrollbar">
                    {activeTab === 'groups' || activeTab === 'profile' ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 opacity-0 animate-in fade-in duration-500 fill-mode-forwards" style={{ opacity: 1 }}>
                            <div className="bg-surface-dark border border-surface-border p-12 rounded-2xl flex flex-col items-center text-center max-w-md w-full shadow-2xl">
                                <div className="size-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-yellow-500 text-4xl">construction</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Đang được xây dựng</h2>
                                <p className="text-text-secondary">
                                    {activeTab === 'groups'
                                        ? 'Tính năng Quản lý nhóm đang trong quá trình phát triển và sẽ sớm ra mắt.'
                                        : 'Tính năng Quản lý thông tin cá nhân đang trong quá trình phát triển và sẽ sớm ra mắt.'}
                                </p>
                                <button
                                    onClick={() => setActiveTab('report')}
                                    className="mt-8 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
                                >
                                    Quay lại Báo cáo
                                </button>
                            </div>
                        </div>) : isLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                        <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto h-full">
                            {/* Summary Stats */}
                            <div className="col-span-12 xl:col-span-5 flex flex-col gap-6 h-full">
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-surface-dark border border-surface-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <div className="text-text-secondary mb-1">
                                            <span className="material-symbols-outlined text-[24px]">menu_book</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{totalSubjects.toString().padStart(2, '0')}</span>
                                        <span className="text-[10px] text-text-secondary mt-1">Môn học</span>
                                    </div>
                                    <div className="bg-surface-dark border border-surface-border rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5"></div>
                                        <div className="text-primary mb-1">
                                            <span className="material-symbols-outlined text-[24px]">assignment</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{completedQuizzes.length.toString().padStart(2, '0')}</span>
                                        <span className="text-[10px] text-text-secondary mt-1">Bài kiểm tra</span>
                                    </div>
                                    <div className="bg-surface-dark border border-surface-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <div className="text-green-500 mb-1">
                                            <span className="material-symbols-outlined text-[24px]">check_circle</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{totalCorrectAnswers}</span>
                                        <span className="text-[10px] text-text-secondary mt-1">Câu đúng</span>
                                    </div>
                                    <div className="bg-surface-dark border border-surface-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <div className="text-yellow-500 mb-1">
                                            <span className="material-symbols-outlined text-[24px]">trending_up</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{avgScore}%</span>
                                        <span className="text-[10px] text-text-secondary mt-1">Trung bình</span>
                                    </div>
                                </div>
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-5 flex flex-col flex-1 overflow-hidden">
                                    <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2 shrink-0">
                                        <span className="material-symbols-outlined text-primary">equalizer</span>
                                        Kết quả theo môn
                                    </h3>
                                    <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 mb-2">
                                        {subjectStats.length > 0 ? (
                                            subjectStats.map((item) => (
                                                <div key={item.id} className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-end text-sm">
                                                        <span className="text-white font-medium truncate max-w-[120px]">{item.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-primary text-[10px] font-bold bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">{item.totalCorrect} câu đúng</span>
                                                            <span className="text-text-secondary text-xs">{item.pct}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-[#111318] rounded-full h-2">
                                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.pct}%` }}></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center">
                                                <p className="text-text-secondary text-sm text-center">Chưa có dữ liệu thống kê</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* History Table */}
                            <div className="col-span-12 xl:col-span-7 flex flex-col h-[600px] xl:h-auto min-h-[500px]">
                                <div className="bg-surface-dark border border-surface-border rounded-xl flex flex-col h-full overflow-hidden">
                                    <div className="p-5 border-b border-surface-border flex justify-between items-center bg-[#232730]">
                                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-text-secondary">history</span>
                                            Lịch sử làm bài kiểm tra
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#1a1d24] sticky top-0 z-10 shadow-sm">
                                                <tr>
                                                    <th
                                                        className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%] cursor-pointer hover:bg-white/5 transition-colors select-none"
                                                        onClick={() => handleSort('started_at')}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {getSortIcon('started_at')}
                                                            Thời gian
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%] cursor-pointer hover:bg-white/5 transition-colors select-none"
                                                        onClick={() => handleSort('subject_name')}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {getSortIcon('subject_name')}
                                                            Môn học
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-[15%] cursor-pointer hover:bg-white/5 transition-colors select-none"
                                                        onClick={() => handleSort('score')}
                                                    >
                                                        <div className="flex items-center justify-center gap-1">
                                                            {getSortIcon('score')}
                                                            Kết quả (Đúng/Tổng)
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-[15%] cursor-pointer hover:bg-white/5 transition-colors select-none"
                                                        onClick={() => handleSort('ratio')}
                                                    >
                                                        <div className="flex items-center justify-center gap-1">
                                                            {getSortIcon('ratio')}
                                                            Tỷ lệ
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right w-[20%] cursor-pointer hover:bg-white/5 transition-colors select-none"
                                                        onClick={() => handleSort('status')}
                                                    >
                                                        <div className="flex items-center justify-end gap-1">
                                                            {getSortIcon('status')}
                                                            Ghi chú
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-border">
                                                {sortedHistory.length > 0 ? (
                                                    sortedHistory.map((row) => {
                                                        const scoreRatio = row.status === 'completed' ? (row.correct_answers || 0) / row.total_questions : 1;
                                                        const isLowScore = row.status === 'completed' && scoreRatio < 0.5;
                                                        const date = new Date(row.started_at);
                                                        const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                                                        return (
                                                            <tr key={row.id} className={`hover:bg-[#282e39]/50 transition-colors group ${isLowScore ? 'bg-red-500/10' : ''}`}>
                                                                <td className="p-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-white text-sm font-medium">{dateStr}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`size-2 rounded-full ${row.status === 'completed' ? 'bg-primary' : 'bg-yellow-500'}`}></div>
                                                                        <span className="text-white text-sm">
                                                                            {subjectsMap[row.quiz_settings?.id_subject] || row.quiz_settings?.id_subject?.toUpperCase() || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    <span className={`text-sm font-bold ${isLowScore ? 'text-red-400' : 'text-text-secondary'}`}>
                                                                        {row.status === 'completed' ? `${row.correct_answers}/${row.total_questions}` : '-'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'completed'
                                                                            ? (isLowScore ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400')
                                                                            : 'bg-yellow-500/10 text-yellow-500'
                                                                        }`}>
                                                                        {row.status === 'completed' ? `${Math.round(scoreRatio * 100)}%` : 'Đang làm'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    {row.status === 'completed' ? (
                                                                        <button
                                                                            onClick={() => handleReview(row)}
                                                                            className="text-xs text-primary font-bold hover:underline"
                                                                        >
                                                                            Xem lại
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-xs text-text-secondary uppercase font-bold tracking-wider">{row.status}</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="p-12 text-center text-text-secondary">Chưa có lịch sử làm bài</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 border-t border-surface-border bg-[#1a1d24] flex justify-between items-center">
                                        <span className="text-xs text-text-secondary">Hiển thị {history.length} kết quả</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Report;
