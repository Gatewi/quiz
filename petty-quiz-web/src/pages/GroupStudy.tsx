import React from 'react';
import { Link } from 'react-router-dom';

const GroupStudy: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="size-24 bg-surface-dark rounded-full flex items-center justify-center mb-6 shadow-xl border border-border-dark">
                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">groups</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tính năng đang cập nhật...
            </h1>
            <p className="text-text-secondary text-lg max-w-md mb-8">
                Chức năng Học nhóm đang được phát triển để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Quay về trang chủ
            </Link>
        </div>
    );
};

export default GroupStudy;
