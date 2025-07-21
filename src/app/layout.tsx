import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOMI - Temukan Resep Terbaikmu",
  description:
    "Aplikasi pencari resep NOMI untuk membantu kamu memasak setiap hari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
