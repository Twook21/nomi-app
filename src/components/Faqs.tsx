"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Data untuk FAQ
const faqData = [
    {
        question: "Apa itu NIMO?",
        answer: "NIMO adalah platform yang menghubungkan Anda dengan restoran, kafe, toko roti, dan UMKM lainnya untuk membeli makanan berlebih yang belum terjual dengan harga diskon. Misi kami adalah mengurangi limbah makanan sambil memberikan Anda penawaran terbaik."
    },
    {
        question: "Bagaimana cara kerja NIMO?",
        answer: "Sangat mudah! 1) Jelajahi aplikasi untuk menemukan 'Deals' dari mitra terdekat. 2) Pesan dan bayar langsung di aplikasi. 3) Kunjungi lokasi mitra pada jam pengambilan yang ditentukan untuk mengambil makanan lezat Anda."
    },
    {
        question: "Apakah makanan yang dijual aman untuk dikonsumsi?",
        answer: "Tentu saja. Makanan yang kami tawarkan adalah makanan berkualitas yang tidak terjual pada hari itu, bukan makanan sisa atau basi. Semua mitra kami berkomitmen untuk menjaga standar kebersihan dan keamanan pangan yang tinggi."
    },
    {
        question: "Kapan saya bisa mengambil pesanan saya?",
        answer: "Setiap 'Deals' memiliki jadwal pengambilan yang spesifik, biasanya mendekati jam tutup toko atau restoran. Pastikan untuk memeriksa detail waktu pengambilan pada setiap penawaran sebelum memesan."
    },
    {
        question: "Bagaimana saya bisa mendaftarkan bisnis saya sebagai mitra NIMO?",
        answer: "Kami senang Anda tertarik! Silakan kunjungi halaman 'Jadi Mitra' di situs web kami dan isi formulir pendaftaran. Tim kami akan segera menghubungi Anda untuk proses selanjutnya."
    }
];

const Faqs = () => {
    // State untuk mengontrol accordion mana yang sedang terbuka
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-16 md:py-24 bg-white dark:bg-[var(--background)] transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan paling umum di sini. Jika Anda tidak menemukannya, jangan ragu untuk menghubungi kami.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqData.map((faq, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {/* Tombol Pertanyaan */}
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center text-left p-5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                            >
                                <span className="font-semibold text-[var(--nimo-dark)]">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-nimo-yellow transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {/* Konten Jawaban */}
                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                            >
                                <div className="p-5 bg-white dark:bg-gray-800">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faqs;