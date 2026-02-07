
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1 State
    const [email, setEmail] = useState('');

    // Step 2 State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Listen for password recovery event (user clicked link in email)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStep(2);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/forgot-password`,
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Đã gửi email khôi phục! Vui lòng kiểm tra hộp thư của bạn.' });
        } catch (error: any) {
            console.error('Reset password error:', error);
            setMessage({ type: 'error', text: error.message || 'Không thể gửi email khôi phục.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Cập nhật mật khẩu thành công! Đang chuyển hướng...' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            console.error('Update password error:', error);
            setMessage({ type: 'error', text: error.message || 'Không thể cập nhật mật khẩu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
            <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6">
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 pb-2">
                        Lấy lại quyền truy cập
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Chúng tôi đã thiết kế quy trình khôi phục an toàn và nhanh chóng cho bạn.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-start">
                    {/* STEP 1: FORGOT PASSWORD */}
                    <div className={`group relative transition-all duration-500 ${step === 2 ? 'opacity-50 scale-95 pointer-events-none' : ''}`}>
                        <div className="absolute -top-10 left-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">Bước 1: Yêu cầu khôi phục</div>
                        <div className="bg-white dark:bg-[#151b26] rounded-2xl border border-slate-200 dark:border-[#282e39] p-8 shadow-xl relative overflow-hidden">
                            <div className="flex flex-col gap-6 relative z-10">
                                <div>
                                    <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-[24px]">lock_person</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Khôi phục mật khẩu</h3>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-sm leading-relaxed">
                                        Nhập địa chỉ email được liên kết với tài khoản của bạn.
                                    </p>
                                </div>

                                {step === 1 && message && (
                                    <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form className="flex flex-col gap-5" onSubmit={handleRequestReset}>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</span>
                                        <div className="relative">
                                            <input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-[#1c1f27] border border-slate-300 dark:border-[#3b4354] rounded-lg h-12 pl-11 pr-4 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-[#5a6275]"
                                                placeholder="example@email.com"
                                                type="email"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">mail</span>
                                        </div>
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-glow flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                                    >
                                        <span>{loading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}</span>
                                        <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </form>
                                <div className="pt-2 border-t border-slate-100 dark:border-[#282e39] text-center">
                                    <Link className="text-sm font-medium text-slate-500 dark:text-[#9da6b9] hover:text-primary transition-colors inline-flex items-center gap-1" to="/login">
                                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                        Quay lại đăng nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: RESET PASSWORD */}
                    <div className={`group relative transition-all duration-500 ${step === 1 ? 'opacity-50 scale-95 pointer-events-none' : ''}`}>
                        <div className="absolute -top-10 left-0 text-xs font-bold uppercase tracking-wider text-primary mb-2">Bước 2: Tạo mật khẩu mới</div>
                        <div className={`bg-white dark:bg-[#151b26] rounded-2xl border ${step === 2 ? 'border-primary ring-1 ring-primary/30' : 'border-slate-200 dark:border-[#282e39]'} p-8 shadow-xl relative overflow-hidden`}>
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex flex-col gap-6 relative z-10">
                                <div>
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-[24px]">encrypted</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Thiết lập mật khẩu mới</h3>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-sm leading-relaxed">
                                        Vui lòng tạo mật khẩu mạnh để bảo vệ tài khoản.
                                    </p>
                                </div>

                                {step === 2 && message && (
                                    <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form className="flex flex-col gap-5" onSubmit={handleUpdatePassword}>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu mới</span>
                                        <div className="relative group/input">
                                            <input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-[#1c1f27] border border-slate-300 dark:border-[#3b4354] rounded-lg h-12 pl-11 pr-11 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                                                type="password"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">lock</span>
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Xác nhận mật khẩu</span>
                                        <div className="relative group/input">
                                            <input
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-[#1c1f27] border border-slate-300 dark:border-[#3b4354] rounded-lg h-12 pl-11 pr-11 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-[#5a6275]"
                                                placeholder="••••••••"
                                                type="password"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">lock_reset</span>
                                        </div>
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-glow mt-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-sm">
                    <p>© 2024 PettyQuiz. Bảo mật thông tin của bạn là ưu tiên hàng đầu.</p>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
