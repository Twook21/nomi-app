/** @type {import('tailwindcss').Config} */
module.exports = {
  // Pastikan ada baris ini
  darkMode: 'class',

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Anda bisa memindahkan variabel warna dari CSS ke sini jika mau,
      // tapi menggunakan variabel CSS juga sudah benar.
    },
  },
  plugins: [],
}