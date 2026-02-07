import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Layout: React.FC = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-solid border-border-dark bg-surface-darker/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>school</span>
                            </div>
                            <h1 className="text-white text-xl font-bold tracking-tight">PettyQuiz</h1>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-1">
                        <Link className="px-4 py-2 text-primary font-semibold text-sm rounded-lg bg-primary/10 transition-colors" to="/">Trang chủ</Link>
                        <Link className="px-4 py-2 text-text-secondary hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors" to="/report">Báo cáo</Link>
                        <Link className="px-4 py-2 text-text-secondary hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors" to="/group">Học nhóm</Link>
                        <Link className="px-4 py-2 text-text-secondary hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors" to="/guide">Hướng dẫn</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dark_mode</span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white leading-none">{profile?.user_name || user.email}</p>
                                    <p className="text-xs text-text-secondary leading-tight mt-1">{profile?.xp_points || 0} XP</p>
                                </div>
                                <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 cursor-pointer flex items-center justify-center font-bold text-white text-xs">
                                    {(profile?.user_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                </div>
                                <button
                                    onClick={() => {
                                        signOut();
                                        navigate('/login');
                                    }}
                                    className="ml-2 text-text-secondary hover:text-red-400 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">Đăng nhập</Link>
                                <Link to="/register" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
