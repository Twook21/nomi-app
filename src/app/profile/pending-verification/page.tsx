"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingVerificationPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-nimo-yellow text-nimo-yellow p-4 rounded-full w-fit">
                        <MailCheck className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">Pendaftaran Sedang Ditinjau</CardTitle>
                    <CardDescription className="text-base">
                        Terima kasih telah mendaftar sebagai mitra UMKM Nomi. Tim kami akan meninjau pendaftaran Anda dalam 1-2 hari kerja. Anda akan menerima notifikasi melalui email setelah proses verifikasi selesai.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/profile">Kembali ke Dasbor</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}