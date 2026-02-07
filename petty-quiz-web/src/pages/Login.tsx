
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        setErrorMsg('');
        if (!email || !password) {
            setErrorMsg('Vui lòng nhập email và mật khẩu.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error);
            setErrorMsg('Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Google login error:', error);
            setErrorMsg('Lỗi đăng nhập Google: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[blob_7s_infinite]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[blob_7s_infinite] [animation-delay:2s]"></div>
                <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[blob_7s_infinite] [animation-delay:4s]"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-[480px] p-6 flex flex-col items-center">
                {/* Logo Section */}
                <div className="mb-8 text-center flex flex-col items-center gap-4">
                    <div className="size-12 text-white">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-white text-2xl font-bold tracking-tight">PettyQuiz</h2>
                    <h1 className="text-white tracking-light text-[32px] font-bold leading-tight text-center pt-2">Chào mừng trở lại</h1>
                    <p className="text-text-secondary text-base font-normal">Vui lòng nhập thông tin đăng nhập của bạn</p>
                </div>

                {/* Form Section */}
                <div className="w-full flex flex-col gap-6">
                    {errorMsg && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}
                    <label className="flex flex-col w-full">
                        <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal transition-all"
                            placeholder="name@example.com"
                            type="email"
                        />
                    </label>
                    <label className="flex flex-col w-full">
                        <div className="flex justify-between items-center pb-2">
                            <p className="text-white text-base font-medium leading-normal">Mật khẩu</p>
                        </div>
                        <div className="relative flex w-full items-stretch rounded-lg">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-14 placeholder:text-gray-500 p-[15px] pr-12 text-base font-normal leading-normal transition-all"
                                placeholder="••••••••"
                                type="password"
                            />
                            <button className="absolute right-0 top-0 bottom-0 px-4 text-text-secondary hover:text-white transition-colors flex items-center justify-center focus:outline-none">
                                <span className="material-symbols-outlined text-[24px]">visibility</span>
                            </button>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Link className="text-text-secondary text-sm font-normal leading-normal hover:text-primary transition-colors" to="/forgot-password">Quên mật khẩu?</Link>
                        </div>
                    </label>
                    <button
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        <span className="truncate">{loading ? 'Đang xử lý...' : 'Đăng nhập'}</span>
                    </button>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-border-dark"></div>
                        <span className="flex-shrink mx-4 text-text-secondary text-sm">Hoặc</span>
                        <div className="flex-grow border-t border-border-dark"></div>
                    </div>
                    <button
                        onClick={handleGoogleLogin} disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 bg-card-dark border border-border-dark hover:bg-white/5 text-white text-base font-medium leading-normal transition-all active:scale-[0.98]">
                        <svg className="size-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M43.611 20.083H42V20H24V28H35.303C33.604 32.946 28.93 36.5 24 36.5C17.096 36.5 11.5 30.904 11.5 24C11.5 17.096 17.096 11.5 24 11.5C27.202 11.5 30.113 12.723 32.333 14.735L38.414 8.654C34.568 5.074 29.507 3 24 3C12.4 3 3 12.4 3 24C3 35.6 12.4 45 24 45C35.6 45 45 35.6 45 24C45 22.665 44.864 21.354 44.611 20.083Z" fill="#FFC107"></path>
                            <path d="M6.306 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.202 12 30.113 13.223 32.333 15.235L38.414 9.154C34.568 5.574 29.507 3.5 24 3.5C16.638 3.5 10.222 7.784 6.306 14.691Z" fill="#FF3D00"></path>
                            <path d="M24 44.5C29.215 44.5 33.992 42.637 37.766 39.497L31.631 34.331C29.407 35.727 26.809 36.5 24 36.5C18.835 36.5 14.007 33.002 12.162 28.272L5.808 33.15C9.576 40.233 16.295 44.5 24 44.5Z" fill="#4CAF50"></path>
                            <path d="M43.611 20.083L43.597 20.042L35.303 28C35.694 26.746 35.917 25.405 35.917 24C35.917 23.473 35.882 22.955 35.816 22.443L24 22.443V20H43.611Z" fill="#1976D2"></path>
                        </svg>
                        <span className="truncate">Đăng nhập bằng Google</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-text-secondary text-sm font-normal leading-normal">
                        Chưa có tài khoản?
                        <Link className="text-primary font-bold hover:text-blue-400 hover:underline transition-all ml-1" to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Login;
