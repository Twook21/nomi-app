"use client";

import { useAuthStore } from "@/store/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export function CartSummaryDialog() {
  const { isCartSummaryOpen, cartSummaryData, closeCartSummary } = useAuthStore();
  const lastAddedItem = cartSummaryData?.cartItems[0];

  return (
    <Dialog open={isCartSummaryOpen} onOpenChange={closeCartSummary}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-green-600">Berhasil Ditambahkan!</DialogTitle>
          <DialogDescription className="text-center">Produk berikut telah ditambahkan ke keranjang Anda.</DialogDescription>
        </DialogHeader>
        {lastAddedItem && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Image src={lastAddedItem.product.imageUrl || ''} alt={lastAddedItem.product.productName} width={80} height={80} className="rounded-md border object-cover"/>
              <div>
                <p className="font-semibold">{lastAddedItem.product.productName}</p>
                <p className="text-sm text-muted-foreground">Jumlah: {lastAddedItem.quantity}</p>
                <p className="text-sm font-medium">{formatRupiah(Number(lastAddedItem.product.discountedPrice))}</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Subtotal Keranjang ({cartSummaryData?.cartItems.length} item)</span>
              <span>{formatRupiah(cartSummaryData?.totalPrice || 0)}</span>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={closeCartSummary}>
            Lanjut Belanja
          </Button>
          {/* PERBAIKAN: Menambahkan onClick untuk menutup dialog sebelum navigasi */}
          <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90" onClick={closeCartSummary}>
            <Link href="/cart">Lihat Keranjang</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}