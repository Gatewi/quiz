
import React from 'react';
import { Link } from 'react-router-dom';
import { mockUserProfile, mockSubjects } from '../data/mock';

const Report: React.FC = () => {
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
                                <h1 className="text-white text-base font-medium leading-normal truncate">{mockUserProfile.user_name}</h1>
                                <p className="text-text-secondary text-xs font-normal leading-normal">XP: {mockUserProfile.xp_points}</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#282e39] transition-colors group" to="/">
                                <span className="material-symbols-outlined text-text-secondary group-hover:text-white" style={{ fontSize: '24px' }}>home</span>
                                <p className="text-text-secondary group-hover:text-white text-sm font-medium leading-normal">Tổng quan</p>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20" to="/report">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>bar_chart</span>
                                <p className="text-primary text-sm font-medium leading-normal">Báo cáo</p>
                            </Link>
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#282e39] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-text-secondary group-hover:text-white" style={{ fontSize: '24px' }}>calendar_today</span>
                                <p className="text-text-secondary group-hover:text-white text-sm font-medium leading-normal">Lịch thi</p>
                            </a>
                        </nav>
                    </div>
                    <div className="px-2">
                        <p className="text-[#4b5563] text-xs text-center">PettyQuiz Portal v2.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header Section */}
                <header className="w-full bg-[#111318] border-b border-[#282e39] p-6 shrink-0 z-10">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div>
                            <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">Báo cáo kết quả</h1>
                            <p className="text-text-secondary text-sm mt-1">Theo dõi tiến độ và lịch sử làm bài của bạn</p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3 w-full xl:w-auto">
                            <div className="flex flex-row gap-3 flex-1 xl:flex-none">
                                <label className="flex flex-col min-w-[140px] flex-1">
                                    <span className="text-text-secondary text-xs font-medium pb-1.5">Từ ngày</span>
                                    <div className="flex w-full items-stretch rounded-lg group">
                                        <input className="flex w-full min-w-0 flex-1 rounded-l-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-surface-border bg-surface-dark focus:border-primary h-10 px-3 text-sm font-normal" type="text" defaultValue="30/01/2026" />
                                        <div className="text-text-secondary flex border border-l-0 border-surface-border bg-surface-dark items-center justify-center px-3 rounded-r-lg">
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="flex flex-col min-w-[140px] flex-1">
                                    <span className="text-text-secondary text-xs font-medium pb-1.5">Đến ngày</span>
                                    <div className="flex w-full items-stretch rounded-lg group">
                                        <input className="flex w-full min-w-0 flex-1 rounded-l-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-surface-border bg-surface-dark focus:border-primary h-10 px-3 text-sm font-normal" type="text" defaultValue="06/02/2026" />
                                        <div className="text-text-secondary flex border border-l-0 border-surface-border bg-surface-dark items-center justify-center px-3 rounded-r-lg">
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="flex gap-3 mt-4 xl:mt-0 flex-1 xl:flex-none justify-end">
                                <Link to="/" className="flex items-center justify-center rounded-lg h-10 px-5 bg-[#282e39] hover:bg-[#323946] text-white text-sm font-bold tracking-[0.015em] transition-colors whitespace-nowrap">
                                    Trang chủ
                                </Link>
                                <Link to="/" className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold tracking-[0.015em] shadow-lg shadow-primary/20 transition-all whitespace-nowrap">
                                    <span className="material-symbols-outlined mr-2 text-[20px]">add_circle</span>
                                    Làm bài thi mới
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth custom-scrollbar">
                    <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
                        {/* Summary Stats */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="text-text-secondary mb-1">
                                        <span className="material-symbols-outlined text-[24px]">menu_book</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">{mockSubjects.length.toString().padStart(2, '0')}</span>
                                    <span className="text-xs text-text-secondary mt-1">Môn học</span>
                                </div>
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5"></div>
                                    <div className="text-primary mb-1">
                                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">08</span>
                                    <span className="text-xs text-text-secondary mt-1">Đã xong</span>
                                </div>
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="text-green-500 mb-1">
                                        <span className="material-symbols-outlined text-[24px]">trending_up</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">82%</span>
                                    <span className="text-xs text-text-secondary mt-1">Trung bình</span>
                                </div>
                            </div>
                            <div className="bg-surface-dark border border-surface-border rounded-xl p-5 flex flex-col flex-1 min-h-[300px]">
                                <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">equalizer</span>
                                    Kết quả theo môn
                                </h3>
                                <div className="flex flex-col gap-5 flex-1 justify-center">
                                    {[
                                        { name: 'Toán học', pct: 92, count: 24, color: 'bg-primary' },
                                        { name: 'Tiếng Anh', pct: 85, count: 10, color: 'bg-blue-400' },
                                        { name: 'Vật Lý', pct: 78, count: 15, color: 'bg-purple-500' },
                                        { name: 'Hóa Học', pct: 64, count: 8, color: 'bg-green-500' },
                                        { name: 'Ngữ văn', pct: 45, count: 5, color: 'bg-red-500' },
                                    ].map((item) => (
                                        <div key={item.name} className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white font-medium">{item.name}</span>
                                                <span className="text-text-secondary">{item.pct}% ({item.count} bài)</span>
                                            </div>
                                            <div className="w-full bg-[#111318] rounded-full h-2.5">
                                                <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="col-span-12 xl:col-span-8 flex flex-col h-[600px] xl:h-auto min-h-[500px]">
                            <div className="bg-surface-dark border border-surface-border rounded-xl flex flex-col h-full overflow-hidden">
                                <div className="p-5 border-b border-surface-border flex justify-between items-center bg-[#232730]">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-secondary">history</span>
                                        Lịch sử làm bài kiểm tra
                                    </h3>
                                    <button className="text-text-secondary hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                        Lọc & Sắp xếp
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#1a1d24] sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%]">Thời gian</th>
                                                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%]">Môn học</th>
                                                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-[15%]">Số câu</th>
                                                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-[15%]">Kết quả</th>
                                                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right w-[20%]">Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-border">
                                            {[
                                                { time: '10:30 AM', date: '06/02/2026', subject: 'Toán học - Lớp 12', questions: 20, result: '90%', resultColor: 'text-green-400', bgColor: 'bg-green-500/10' },
                                                { time: '09:15 AM', date: '05/02/2026', subject: 'Tiếng Anh - Unit 1', questions: 40, result: '75%', resultColor: 'text-blue-400', bgColor: 'bg-blue-500/10' },
                                                { time: '14:00 PM', date: '04/02/2026', subject: 'Ngữ văn - Tự luận', questions: 15, result: '40%', resultColor: 'text-red-500', bgColor: 'bg-red-500/5', lowScore: true },
                                            ].map((row, idx) => (
                                                <tr key={idx} className={`${row.lowScore ? 'bg-red-500/5 border-l-2 border-l-red-500' : ''} hover:bg-[#282e39]/50 transition-colors group`}>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-white text-sm font-medium">{row.time}</span>
                                                            <span className="text-text-secondary text-xs">{row.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`size-2 rounded-full ${row.lowScore ? 'bg-red-500' : 'bg-primary'}`}></div>
                                                            <span className="text-white text-sm">{row.subject}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="text-text-secondary text-sm">{row.questions}</span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.bgColor} ${row.resultColor}`}>
                                                            {row.result}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button className={`text-sm font-medium inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity ${row.lowScore ? 'text-red-400' : 'text-primary'}`}>
                                                            {row.lowScore ? 'Xem ngay' : 'Xem câu sai'}
                                                            <span className="material-symbols-outlined text-[16px]">{row.lowScore ? 'double_arrow' : 'chevron_right'}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-surface-border bg-[#1a1d24] flex justify-between items-center">
                                    <span className="text-xs text-text-secondary">Hiển thị 3 / 08 kết quả</span>
                                    <div className="flex gap-2">
                                        <button className="p-1 rounded hover:bg-[#323946] text-text-secondary disabled:opacity-50">
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>
                                        <button className="p-1 rounded hover:bg-[#323946] text-white">
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Report;
