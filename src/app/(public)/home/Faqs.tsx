"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        question: "Apa itu NIMO?",
        answer: "NIMO adalah aplikasi yang membantu mengurangi limbah makanan dengan menghubungkan UMKM, restoran, dan toko roti dengan pembeli. Lewat NIMO, Anda bisa membeli makanan berkualitas yang belum terjual di akhir hari dengan harga diskon hingga 70%."
    },
    // {
    //     question: "Bagaimana cara kerja NIMO?",
    //     answer: "1️⃣ Cari penawaran menarik dari mitra terdekat di aplikasi.\n2️⃣ Pesan dan bayar langsung melalui NIMO.\n3️⃣ Ambil pesanan Anda pada waktu pengambilan yang tertera di aplikasi. Mudah, cepat, dan ikut membantu bumi 🌱."
    // },
    {
        question: "Apakah makanan yang dijual benar-benar aman dikonsumsi?",
        answer: "Ya! Semua makanan yang tersedia adalah stok berlebih yang masih segar dan layak konsumsi. Mitra kami sudah memastikan standar kebersihan dan kualitasnya sebelum dijual di NIMO."
    },
    {
        question: "Mengapa saya harus membeli makanan lewat NIMO?",
        answer: "Dengan membeli lewat NIMO, Anda bukan hanya mendapatkan makanan enak dengan harga miring 🍱, tapi juga berperan aktif mengurangi food waste yang berkontribusi pada perubahan iklim."
    },
    // {
    //     question: "Kapan saya bisa mengambil pesanan saya?",
    //     answer: "Setiap mitra memiliki jam pengambilan yang berbeda, biasanya mendekati jam tutup toko atau restoran. Pastikan untuk memeriksa detail waktu pengambilan pada setiap 'Deal' sebelum checkout."
    // },
    {
        question: "Bagaimana cara mendaftarkan bisnis saya di NIMO?",
        answer: "Mudah! Kunjungi halaman 'Jadi Mitra' di aplikasi atau situs kami, isi formulir pendaftaran, dan tim NIMO akan menghubungi Anda untuk memulai perjalanan sebagai mitra penyelamat makanan."
    },
    // {
    //     question: "Apakah ada biaya untuk menjadi mitra NIMO?",
    //     answer: "Tidak ada biaya pendaftaran. Kami hanya mengambil komisi kecil dari setiap transaksi yang berhasil untuk mendukung operasional platform."
    // },
    {
        question: "Siapa saja yang bisa menggunakan NIMO?",
        answer: "Semua orang! Baik Anda konsumen yang mencari makanan hemat, atau pemilik bisnis yang ingin meminimalkan kerugian dari stok berlebih."
    },
    // {
    //     question: "Apakah saya harus mengunduh aplikasi untuk menggunakan NIMO?",
    //     answer: "Ya, saat ini layanan NIMO tersedia melalui aplikasi mobile di Android & iOS untuk memudahkan pengalaman pengguna."
    // },
    // {
    //     question: "Bagaimana jika saya mengalami masalah saat menggunakan aplikasi?",
    //     answer: "Jangan khawatir! Anda bisa menghubungi tim support kami lewat menu 'Bantuan' di aplikasi atau kirim email ke support@nimo.id. Kami siap membantu Anda 💬."
    // }
];


const Faqs = () => {
    // State untuk mengontrol accordion mana yang sedang terbuka
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-16 md:py-24 bg-white dark:bg-[var(--background)] transition-colors duration-300" >
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-[var(--nimo-dark)] mt-3 text-lg max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan paling umum di sini. Jika Anda tidak menemukannya, jangan ragu untuk menghubungi kami.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqData.map((faq, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {/* Tombol Pertanyaan */}
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center text-left p-5 bg-gray-800 hover:bg-gray-700/60 transition-colors"
                            >
                                <span className="font-semibold text-white">{faq.question}</span>
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