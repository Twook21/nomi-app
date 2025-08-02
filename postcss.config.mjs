// postcss.config.mjs atau postcss.config.js (jika type: module di package.json)
const config = {
  plugins: {
    // Ganti 'tailwindcss' dengan '@tailwindcss/postcss'
    "@tailwindcss/postcss": {}, // Ini yang benar untuk mengaktifkan Tailwind CSS v4
    autoprefixer: {}, // Ini penting untuk kompatibilitas browser
  },
};

export default config; // Menggunakan sintaks ES Module
