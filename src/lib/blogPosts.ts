export interface Post {
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  imageUrl: string;
  summary: string;
  source: string;
}

export const blogPosts: Post[] = [
  {
    slug: "ri-nomor-2-dunia-soal-food-waste",
    title:
      "RI Nomor 2 di Dunia soal Food Waste, Ini Saran untuk Pemilik Restoran",
    category: "Fakta & Data",
    author: "SampleNews",
    publishedDate: "24 Feb 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Indonesia menjadi salah satu negara dengan tingkat pemborosan makanan tertinggi di dunia. Artikel ini membahas saran praktis dari FAO untuk pemilik restoran dalam menekan angka food waste.",
    source: "https://www.bisnis.com/topic/52736/food-waste",
  },
  {
    slug: "kerugian-ekonomi-akibat-sisa-makanan",
    title: "Sisa Makanan Bikin Rugi Ekonomi Rp 551 Triliun Per Tahun",
    category: "Ekonomi",
    author: "SampleNews",
    publishedDate: "27 Mei 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Pemborosan makanan tidak hanya berdampak pada lingkungan, tetapi juga menyebabkan kerugian ekonomi yang masif, mencapai ratusan triliun rupiah setiap tahunnya di Indonesia.",
    source: "https://www.kompas.com/tag/food-waste",
  },
  {
    slug: "ironi-sampah-makanan-dan-kelaparan",
    title:
      "Ironi Sampah Makanan: Miliaran Ton Terbuang Saat Ratusan Juta Kelaparan",
    category: "Sosial",
    author: "SampleNews",
    publishedDate: "20 Juni 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Setiap tahun, dunia membuang miliaran ton makanan sementara jutaan orang masih mengalami kelaparan kronis. Sebuah ironi yang membutuhkan solusi bersama.",
    source: "https://www.liputan6.com/tag/food-waste",
  },
  {
    slug: "mengintip-cara-garda-pangan-selamatkan-makanan",
    title: "Mengintip Cara Garda Pangan Selamatkan Makanan Berpotensi Terbuang",
    category: "Inisiatif",
    author: "SampleNews",
    publishedDate: "04 Jun 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Garda Pangan adalah salah satu inisiatif food rescue yang aktif di Indonesia. Pelajari bagaimana mereka bekerja untuk menyelamatkan dan mendistribusikan makanan berlebih.",
    source: "https://www.detik.com/tag/food-waste",
  },
  {
    slug: "darurat-sampah-makanan-hampir-50-juta-ton",
    title:
      "Indonesia Darurat Sampah Makanan Hampir 50 Juta Ton, Ini Akar Masalahnya",
    category: "Analisis",
    author: "SampleNews",
    publishedDate: "10 Jul 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Dengan total sampah makanan mencapai puluhan juta ton, Indonesia menghadapi krisis serius. Artikel ini mengupas akar permasalahan dari kesadaran masyarakat hingga kebijakan.",
    source:
      "https://www.detik.com/properti/berita/d-7432071/indonesia-darurat-sampah-makanan-hampir-50-juta-ton-ini-akar-masalahnya",
  },
  {
    slug: "membangun-kesadaran-dari-atas-piring",
    title: "Membangun Kesadaran dari Atas Piring",
    category: "Gaya Hidup",
    author: "SampleNews",
    publishedDate: "20 Jun 2025",
    imageUrl: "/images/news/image.png",
    summary:
      "Mengurangi food waste dimulai dari kebiasaan kecil di meja makan. Bagaimana kita bisa membangun kesadaran dan mengubah perilaku konsumsi sehari-hari?",
    source: "https://www.detik.com/tag/food-waste",
  },
];
