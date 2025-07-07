import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mengimpor font Inter dari Google Fonts
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NIMO - Temukan Resep Terbaikmu",
  description: "Aplikasi pencari resep NIMO untuk membantu kamu memasak setiap hari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}