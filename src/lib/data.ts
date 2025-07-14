export type User = {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

export const mockUsers: User[] = [
  {
    id: 1,
    fullName: "Andi Budianto",
    email: "andi.b@example.com",
    role: "admin",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    fullName: "Citra Lestari",
    email: "citra.l@example.com",
    role: "user",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: 3,
    fullName: "Doni Firmansyah",
    email: "doni.f@example.com",
    role: "user",
    createdAt: "2024-03-05T09:00:00Z",
  },
  {
    id: 4,
    fullName: "Eka Wijaya",
    email: "eka.w@example.com",
    role: "user",
    createdAt: "2024-04-10T08:15:00Z",
  },
  {
    id: 5,
    fullName: "Fitriani Sari",
    email: "fitriani.s@example.com",
    role: "user",
    createdAt: "2024-05-22T11:20:00Z",
  },
  {
    id: 6,
    fullName: "Guntur Perkasa",
    email: "guntur.p@example.com",
    role: "admin",
    createdAt: "2024-06-30T16:45:00Z",
  },
  {
    id: 7,
    fullName: "Hesti Puspita",
    email: "hesti.p@example.com",
    role: "user",
    createdAt: "2024-08-01T09:15:00Z",
  },
  {
    id: 8,
    fullName: "Indra Gunawan",
    email: "indra.g@example.com",
    role: "user",
    createdAt: "2024-10-19T13:00:00Z",
  },
  {
    id: 9,
    fullName: "Joko Susilo",
    email: "joko.s@example.com",
    role: "user",
    createdAt: "2024-12-25T20:00:00Z",
  },
  {
    id: 10,
    fullName: "Kartika Dewi",
    email: "kartika.d@example.com",
    role: "user",
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    id: 11,
    fullName: "Lia Ramadhani",
    email: "lia.r@example.com",
    role: "user",
    createdAt: "2025-03-11T14:00:00Z",
  },
  {
    id: 12,
    fullName: "Mega Utami",
    email: "mega.u@example.com",
    role: "user",
    createdAt: "2025-05-02T18:10:00Z",
  },
  {
    id: 13,
    fullName: "Naufal Hidayat",
    email: "naufal.h@example.com",
    role: "user",
    createdAt: "2025-07-07T07:05:00Z",
  },
];

// Berita 
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
    title: "RI Nomor 2 di Dunia soal Food Waste, Ini Saran untuk Pemilik Restoran",
    category: "Fakta & Data",
    author: "Bisnis.com",
    publishedDate: "24 Feb 2024",
    imageUrl: "https://cdn.bisnis.com/posts/2023/09/27/1689815/food-waste.jpg",
    summary: "Indonesia menjadi salah satu negara dengan tingkat pemborosan makanan tertinggi di dunia. Artikel ini membahas saran praktis dari FAO untuk pemilik restoran dalam menekan angka food waste.",
    source: "https://www.bisnis.com/topic/52736/food-waste"
  },
  {
    slug: "kerugian-ekonomi-akibat-sisa-makanan",
    title: "Sisa Makanan Bikin Rugi Ekonomi Rp 551 Triliun Per Tahun",
    category: "Ekonomi",
    author: "Kompas.com",
    publishedDate: "27 Mei 2024",
    imageUrl: "https://asset.kompas.com/crops/WQk_7qFzZRtAqYECktIC4kY4fjQ=/0x0:780x390/750x500/data/photo/2024/02/21/65d5e7e4e1a60.jpg",
    summary: "Pemborosan makanan tidak hanya berdampak pada lingkungan, tetapi juga menyebabkan kerugian ekonomi yang masif, mencapai ratusan triliun rupiah setiap tahunnya di Indonesia.",
    source: "https://www.kompas.com/tag/food-waste"
  },
  {
    slug: "ironi-sampah-makanan-dan-kelaparan",
    title: "Ironi Sampah Makanan: Miliaran Ton Terbuang Saat Ratusan Juta Kelaparan",
    category: "Sosial",
    author: "Liputan6.com",
    publishedDate: "20 Juni 2024",
    imageUrl: "https://cdn1-production-images-kly.akamaized.net/xvSg_jegZUE0V-nVJeKj7tfQrSU=/640x426/smart/filters:quality(75):strip_icc():format(webp)/liputan6-media-api-production.s3.amazonaws.com/images/665e30f14721e8b4310d44f3/6544562447e26-5-food-waste.jpg",
    summary: "Setiap tahun, dunia membuang miliaran ton makanan sementara jutaan orang masih mengalami kelaparan kronis. Sebuah ironi yang membutuhkan solusi bersama.",
    source: "https://www.liputan6.com/tag/food-waste"
  },
  {
    slug: "mengintip-cara-garda-pangan-selamatkan-makanan",
    title: "Mengintip Cara Garda Pangan Selamatkan Makanan Berpotensi Terbuang",
    category: "Inisiatif",
    author: "DetikJatim",
    publishedDate: "04 Jun 2024",
    imageUrl: "https://akcdn.detik.net.id/visual/2024/01/10/garda-pangan.jpeg?w=650&q=90",
    summary: "Garda Pangan adalah salah satu inisiatif food rescue yang aktif di Indonesia. Pelajari bagaimana mereka bekerja untuk menyelamatkan dan mendistribusikan makanan berlebih.",
    source: "https://www.detik.com/tag/food-waste"
  },
  {
    slug: "darurat-sampah-makanan-hampir-50-juta-ton",
    title: "Indonesia Darurat Sampah Makanan Hampir 50 Juta Ton, Ini Akar Masalahnya",
    category: "Analisis",
    author: "DetikProperti",
    publishedDate: "10 Jul 2024",
    imageUrl: "https://akcdn.detik.net.id/community/media/visual/2024/02/26/sampah-makanan.jpeg?w=700&q=90",
    summary: "Dengan total sampah makanan mencapai puluhan juta ton, Indonesia menghadapi krisis serius. Artikel ini mengupas akar permasalahan dari kesadaran masyarakat hingga kebijakan.",
    source: "https://www.detik.com/properti/berita/d-7432071/indonesia-darurat-sampah-makanan-hampir-50-juta-ton-ini-akar-masalahnya"
  },
  {
    slug: "membangun-kesadaran-dari-atas-piring",
    title: "Membangun Kesadaran dari Atas Piring",
    category: "Gaya Hidup",
    author: "DetikNews",
    publishedDate: "20 Jun 2024",
    imageUrl: "https://akcdn.detik.net.id/visual/2023/12/12/makanan-terbuang_43.jpeg?w=650&q=90",
    summary: "Mengurangi food waste dimulai dari kebiasaan kecil di meja makan. Bagaimana kita bisa membangun kesadaran dan mengubah perilaku konsumsi sehari-hari?",
    source: "https://www.detik.com/tag/food-waste"
  }
];
