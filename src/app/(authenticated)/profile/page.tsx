"use client";

import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang, {user?.username || 'Pengguna'}!</h1>
          <p className="text-muted-foreground">
            Berikut adalah ringkasan aktivitas Anda di Nomi.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mulai Belanja</CardTitle>
              <CardDescription>
                Jelajahi berbagai penawaran menarik dan selamatkan makanan lezat hari ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                <Link href="/products">
                  Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pesanan Anda</CardTitle>
              <CardDescription>
                Lihat status pesanan terbaru Anda dan lacak semua transaksi yang pernah Anda buat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/profile/orders">
                  Lihat Riwayat Pesanan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}