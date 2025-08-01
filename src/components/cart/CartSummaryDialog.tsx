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

  const calculateSubtotal = () => {
    if (!cartSummaryData?.cartItems) return 0;
    
    return cartSummaryData.cartItems.reduce((total, item) => {
      const price = Number(item.product.discountedPrice);
      const quantity = item.quantity;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <Dialog open={isCartSummaryOpen} onOpenChange={closeCartSummary}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl text-nimo-yellow font-bold">Berhasil Ditambahkan</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Produk telah ditambahkan ke keranjang Anda.
          </DialogDescription>
        </DialogHeader>
        {lastAddedItem && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Image 
                src={lastAddedItem.product.imageUrl || ''} 
                alt={lastAddedItem.product.productName} 
                width={80} 
                height={80} 
                className="rounded-lg border object-cover flex-shrink-0"
              />
              <div className="flex-grow">
                <p className="font-semibold">{lastAddedItem.product.productName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatRupiah(Number(lastAddedItem.product.discountedPrice))} x {lastAddedItem.quantity}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Subtotal ({cartSummaryData?.cartItems.length} item)</span>
              <span className="text-nimo-yellow text-base font-semibold">{formatRupiah(subtotal)}</span>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row-reverse sm:justify-between gap-2 pt-4">
          <Button 
            asChild 
            className="w-full sm:w-auto bg-nimo-yellow hover:bg-yellow-300"
            onClick={closeCartSummary}
          >
            <Link href="/cart" className="text-white">Lihat Keranjang</Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={closeCartSummary} 
            className="w-full sm:w-auto text-muted-foreground border border-gray-400 hover:bg-gray-100 hover:text-foreground"
          >
            Lanjut Belanja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}