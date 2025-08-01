# 🌱 NOMI - Aplikasi Anti Food Waste
**NOMI** adalah aplikasi web yang dikembangkan untuk membantu mengurangi food waste dengan menyediakan fitur pengelolaan makanan secara efektif.  
Project ini dibuat sebagai bagian dari **Capstone Project** program **Fullstack Developer - Jabar Istimewa Digital Academy Course**.

---

## 🚀 Tech Stack
- **Next.js** (React Framework)
- **TypeScript** (Typed JavaScript)
- **Tailwind CSS** (Utility-first CSS Framework)

---

## 📂 Struktur Proyek
- `pages/` – Berisi halaman-halaman aplikasi.
- `components/` – Komponen UI yang dapat digunakan kembali.

---

## 📝 Fitur
✅ **Frontend Modern**
- Menggunakan Tailwind CSS untuk tampilan yang minimalis dan responsif.
- OAuth dengan Google

---

## 👥 Flow Role Pengguna

### 🛒 **Customer (Pembeli)**
1. **Login/Register**
   - Login menggunakan OAuth Google
   - Register dengan email/password
2. **Berbelanja**
   - Memilih produk yang tersedia
   - Memasukkan produk ke keranjang belanja
   - Melakukan checkout pembayaran
3. **Tracking Pesanan**
   - Memantau status pesanan hingga sampai
   - Memberikan ulasan dan rating produk setelah pesanan selesai

### 🏪 **UMKM Owner (Penjual)**
1. **Login & Pendaftaran Mitra**
   - Login menggunakan akun customer yang sudah ada (dual auth)
   - Mengajukan permohonan untuk menjadi mitra UMKM
   - Menunggu persetujuan dari admin
2. **Dashboard UMKM** (setelah disetujui)
   - Mengakses dashboard khusus UMKM
   - Memantau grafik penjualan dan analitik
   - Menambahkan dan mengelola produk
   - Memantau pesanan masuk
   - Memberikan update status pesanan (diproses, dikirim, selesai)

### 👨‍💼 **Admin (Administrator)**
1. **Manajemen Sistem**
   - Login sebagai admin dengan hak akses penuh
   - Memverifikasi dan menyetujui pendaftaran UMKM baru
   - Mengelola seluruh sistem aplikasi
   - Monitoring aktivitas platform
   - Mengelola user dan konten

---

## 📦 Instalasi
1. Clone repository ini:
```bash
git clone https://github.com/Twook21/nomi-app.git
```
2. Masuk ke folder project:
   ```bash
   cd nomi-app
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Jalankan development server:
   ```bash
   pnpm run dev
   ```
5. Buka di browser:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Catatan Developer
📌 Untuk **Tugas** Capstone:
- **CRUD dengan API dan koneksi Database Postgres Neon** 
- **Implementasi NextAuth** 

---

## 👨‍💻 Kontributor
- Akmal Bintang Budiawan – *Fullstack Developer*

---