
import React, { useState } from 'react';

const Guide: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        { id: 1, q: 'Làm thế nào để tạo một bài kiểm tra mới?', a: "Bạn có thể tạo bài kiểm tra mới bằng cách chọn trình độ, môn học và số lượng câu hỏi trên trang chủ, sau đó chọn các chương bài tập và nhấn 'Tạo bài kiểm tra'." },
        { id: 2, q: 'Tôi có thể chia sẻ bài quiz với người khác không?', a: "Có. Sau khi hoàn tất bài kiểm tra, bạn nhấn vào nút 'Chia sẻ'. Hệ thống sẽ cung cấp cho bạn một đường link trực tiếp hoặc mã QR để bạn gửi cho học sinh hoặc người tham gia." },
        { id: 3, q: 'Làm sao để xem lại lịch sử làm bài?', a: "Truy cập vào mục 'Báo cáo' trên thanh điều hướng. Tại đây, bạn sẽ thấy danh sách tất cả các bài kiểm tra đã tham gia cùng với điểm số chi tiết và thời gian hoàn thành." },
        { id: 4, q: 'PettyQuizWeb có miễn phí không?', a: "PettyQuizWeb cung cấp gói miễn phí với đầy đủ các tính năng cơ bản để tạo và tham gia bài kiểm tra. Tuy nhiên, các tính năng Pro sẽ sớm được ra mắt." },
        { id: 5, q: 'Tôi quên mật khẩu thì phải làm sao?', a: 'Tại màn hình đăng nhập, vui lòng chọn liên kết "Quên mật khẩu". Hệ thống sẽ yêu cầu bạn nhập địa chỉ email đã đăng ký để gửi hướng dẫn đặt lại mật khẩu mới.' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
            <main className="flex-grow">
                <section className="py-12 md:py-16">
                    <div className="container mx-auto max-w-[960px] px-4 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Hỗ trợ khách hàng</span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Câu hỏi thường gặp</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Tìm kiếm câu trả lời nhanh chóng cho các vấn đề bạn đang gặp phải khi sử dụng PettyQuizWeb.
                        </p>
                    </div>
                </section>

                <section className="pb-16">
                    <div className="container mx-auto max-w-[800px] px-4">
                        <div className="flex flex-col gap-4">
                            {faqs.map((faq, idx) => (
                                <div key={faq.id} className={`group bg-white dark:bg-surface-dark rounded-xl border transition-all duration-300 ${openIndex === idx ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-100 dark:border-[#282e39] hover:border-primary/50'}`}>
                                    <div
                                        className="flex cursor-pointer items-center justify-between p-5 md:p-6 select-none"
                                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <span className="text-primary font-bold text-lg opacity-80">{faq.id.toString().padStart(2, '0')}.</span>
                                            <h3 className={`font-bold text-base md:text-lg transition-colors ${openIndex === idx ? 'text-primary' : 'text-slate-800 dark:text-white group-hover:text-primary'}`}>{faq.q}</h3>
                                        </div>
                                        <span className={`material-symbols-outlined text-slate-400 dark:text-slate-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                                    </div>
                                    {openIndex === idx && (
                                        <div className="px-5 md:px-6 pb-6 pt-0 ml-[calc(1.125rem+1rem)] md:ml-[calc(1.125rem+1.5rem)] animate-[sweep_0.3s_ease-in-out]">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                                                {faq.a}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-white dark:bg-[#0d121c] border-t border-gray-100 dark:border-[#282e39]">
                    <div className="container mx-auto max-w-[960px] px-4">
                        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                            <div className="flex flex-col gap-4 max-w-lg text-center md:text-left">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                    Bạn vẫn cần hỗ trợ?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">
                                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7. Đừng ngần ngại liên hệ.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-[#3b4354] hover:border-primary dark:hover:border-primary transition-all cursor-pointer">
                                    <div className="size-12 rounded-full bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Gửi email</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-3">Phản hồi trong vòng 2h</p>
                                        <a className="text-primary font-semibold text-sm hover:underline" href="mailto:support@pettyquiz.com">support@pettyquiz.com</a>
                                    </div>
                                </div>
                                <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-[#3b4354] hover:border-primary dark:hover:border-primary transition-all cursor-pointer">
                                    <div className="size-12 rounded-full bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Hotline</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-3">Hỗ trợ trực tuyến 24/7</p>
                                        <a className="text-primary font-semibold text-sm hover:underline" href="tel:19001234">1900 1234</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Guide;
