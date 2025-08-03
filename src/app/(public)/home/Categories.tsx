import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head"; 
import { ArrowRight } from "lucide-react";

const categoriesData = [
  { name: "Makanan Kering", slug: "makanan-kering", imageUrl: "/images/makanan_kering.png", description: "Keripik, kue kering, dan makanan ringan kemasan." },
  { name: "Roti dan Kue", slug: "roti-dan-kue", imageUrl: "/images/bakery.png", description: "Aneka pastry, roti tawar, dan kue lezat." },
  { name: "Makanan Olahan", slug: "makanan-olahan", imageUrl: "/images/prosses-food.jpg", description: "Frozen food, makanan kaleng, dan sejenisnya." },
  { name: "Minuman", slug: "minuman", imageUrl: "/images/drinks.png", description: "Kopi, jus, teh, dan minuman kemasan lainnya." },
];

const Categories = () => {
  return (
    <>
      <Head>
        <title>Kategori Makanan di Nimo - Temukan Makanan Hemat dan Selamatkan Bumi</title>
        <meta name="description" content="Jelajahi berbagai kategori makanan di Nimo seperti Makanan Kering, Roti dan Kue, Makanan Olahan, dan Minuman. Dapatkan produk berkualitas dengan harga terjangkau dan bantu kurangi food waste." />
        <meta name="keywords" content="kategori makanan, Nimo, makanan kering, roti, kue, minuman, makanan olahan, beli makanan, diskon makanan, anti food waste" />
        
        <meta property="og:title" content="Kategori Makanan di Nimo" />
        <meta property="og:description" content="Temukan beragam kategori makanan yang bisa Anda selamatkan hari ini di Nimo. Mulai dari roti, kue, minuman, hingga makanan olahan." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/kategori" />
        <meta property="og:site_name" content="Nimo" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kategori Makanan di Nimo" />
        <meta name="twitter:description" content="Jelajahi kategori makanan favoritmu dan mulai selamatkan makanan berlebih bersama Nimo sekarang!" />
      </Head>
      <section id="categories" className="py-20 bg-nimo-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-nimo-dark">Jelajahi Kategori</h2>
            <p className="text-[var(--nimo-dark)] mt-3 text-lg">Temukan jenis makanan yang ingin kamu selamatkan hari ini.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesData.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} className="relative block rounded-2xl shadow-lg overflow-hidden group h-80 focus:outline-none focus:ring-4 focus:ring-nimo-yellow focus:ring-opacity-50">
                <Image src={category.imageUrl} alt={`Gambar kategori ${category.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" style={{ objectFit: 'cover' }} className="group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                  <div className="flex-1 pr-2">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <p className="text-gray-200 text-sm mt-1 line-clamp-2">{category.description}</p>
                  </div>
                  <div className="bg-nimo-yellow text-white p-2 rounded-full transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;