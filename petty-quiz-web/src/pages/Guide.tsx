
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import type { QuestionAnswer } from '../types';

const Guide: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<QuestionAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data, error } = await supabase
                    .from('questions_answers')
                    .select('*')
                    .order('sort', { ascending: true });

                if (error) throw error;
                if (data) setFaqs(data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
            <main className="flex-grow">
                <section className="py-12 md:py-16">
                    <div className="container mx-auto max-w-[960px] px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Câu hỏi thường gặp</h2>
                    </div>
                </section>

                <section className="pb-16">
                    <div className="container mx-auto max-w-[800px] px-4">
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {faqs.map((faq, idx) => (
                                        <div key={faq.id_qa} className={`group bg-white dark:bg-surface-dark rounded-xl border transition-all duration-300 ${openIndex === idx ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-100 dark:border-[#282e39] hover:border-primary/50'}`}>
                                            <div
                                                className="flex cursor-pointer items-center justify-between p-5 md:p-6 select-none"
                                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                            >
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-primary font-bold text-lg opacity-80">{(idx + 1).toString().padStart(2, '0')}.</span>
                                                    <h3 className={`font-bold text-base md:text-lg transition-colors ${openIndex === idx ? 'text-primary' : 'text-slate-800 dark:text-white group-hover:text-primary'}`}>{faq.qa_question}</h3>
                                                </div>
                                                <span className={`material-symbols-outlined text-slate-400 dark:text-slate-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                                            </div>
                                            {openIndex === idx && (
                                                <div className="px-5 md:px-6 pb-6 pt-0 ml-[calc(1.125rem+1rem)] md:ml-[calc(1.125rem+1.5rem)] animate-[sweep_0.3s_ease-in-out]">
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                                        {faq.qa_answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-white dark:bg-[#0d121c] border-t border-gray-100 dark:border-[#282e39]">
                    <div className="container mx-auto max-w-[960px] px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                            <div className="flex-1 text-center md:text-left max-w-2xl">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                    Bạn vẫn cần hỗ trợ?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">
                                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn. Đừng ngần ngại liên hệ với chúng tôi qua email.
                                </p>
                            </div>

                            <a href="mailto:info@fimi.vn" className="shrink-0 group flex items-center gap-6 p-6 pr-12 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-[#3b4354] hover:border-primary dark:hover:border-primary transition-all cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                                <div className="size-16 rounded-full bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                                    <span className="material-symbols-outlined text-3xl">mail</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Email hỗ trợ</p>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-2xl group-hover:text-primary transition-colors tracking-tight">info@fimi.vn</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Guide;
