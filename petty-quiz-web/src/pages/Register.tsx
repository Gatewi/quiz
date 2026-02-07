
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async () => {
        setErrorMsg('');
        if (!email || !password || !fullName) {
            setErrorMsg('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (password.length < 6) {
            setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);
        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (authError) throw authError;

            // Check if user is created but waiting for confirmation
            if (authData.user && !authData.session) {
                alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.');
                // Try to create profile if possible, it might fail due to RLS if not logged in
                // We rely on database triggers or user logging in later to create profile if this fails
            }

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id_user: authData.user.id,
                            user_email: email,
                            user_name: fullName,
                            is_active: true,
                            user_role: 'student'
                        }
                    ]);

                if (profileError) {
                    console.error('Error creating profile (likely RLS or trigger exists):', profileError);
                    // Do NOT block success if it is just a profile insert error (could be RLS)
                    // The triggers in standard Supabase setups often handle this
                }

                if (authData.session) {
                    alert('Đăng ký thành công! Đang đăng nhập...');
                    navigate('/');
                } else {
                    navigate('/login');
                }
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setErrorMsg(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[blob_7s_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[blob_7s_infinite] [animation-delay:2s]"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-[480px] p-6 flex flex-col items-center">
                {/* Logo Section */}
                <div className="mb-6 text-center flex flex-col items-center gap-4">
                    <div className="size-12 text-white">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-white text-2xl font-bold tracking-tight">PettyQuiz</h2>
                    <h1 className="text-white tracking-light text-[32px] font-bold leading-tight text-center pt-2">Tạo tài khoản mới</h1>
                </div>

                {/* Form Section */}
                <div className="w-full flex flex-col gap-5">
                    {errorMsg && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    <label className="flex flex-col w-full">
                        <p className="text-white text-base font-medium leading-normal pb-2">Họ và tên</p>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-12 placeholder:text-gray-500 p-[15px] text-base font-normal transition-all"
                            placeholder="Nguyễn Văn A"
                            type="text"
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-12 placeholder:text-gray-500 p-[15px] text-base font-normal transition-all"
                            placeholder="name@example.com"
                            type="email"
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-white text-base font-medium leading-normal pb-2">Mật khẩu</p>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-12 placeholder:text-gray-500 p-[15px] text-base font-normal transition-all"
                            placeholder="••••••••"
                            type="password"
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-white text-base font-medium leading-normal pb-2">Xác nhận mật khẩu</p>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-600 bg-[#1a1d24] focus:border-primary h-12 placeholder:text-gray-500 p-[15px] text-base font-normal transition-all"
                            placeholder="••••••••"
                            type="password"
                        />
                    </label>

                    <button
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-2"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-text-secondary text-sm font-normal leading-normal">
                            Đã có tài khoản?
                            <Link className="text-primary font-bold hover:text-blue-400 hover:underline transition-all ml-1" to="/login">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
