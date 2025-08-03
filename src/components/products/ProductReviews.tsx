"use client";

import React, { useState } from "react"; // --- PERBAIKAN: Import useState ---
import type { Review } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // --- PERBAIKAN: Import Button ---

interface ProductReviewsProps {
  reviews: Review[];
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return "Invalid Date";
  }
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 md:h-4 md:w-4 ${i < rating ? 'text-nimo-yellow fill-nimo-yellow' : 'text-muted-foreground/50'}`} 
      />
    ))}
  </div>
);

export function ProductReviews({ reviews }: ProductReviewsProps) {
  // --- PERBAIKAN: Tambahkan state untuk mengelola jumlah ulasan yang terlihat ---
  const [visibleReviews, setVisibleReviews] = useState(3);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
        Belum ada ulasan untuk produk ini.
      </div>
    );
  }

  const validReviews = reviews.filter(review => typeof review.rating === 'number' && review.rating >= 0 && review.rating <= 5);

  const averageRating = validReviews.length > 0 
    ? (validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length).toFixed(1) 
    : '0.0';

  const hasMoreReviews = reviews.length > visibleReviews;

  return (
    <Card className="bg-[var(--nimo-light)] dark:bg-card border-border/50">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-2xl">Ulasan Pelanggan</CardTitle>
        <div className="flex items-center gap-2 pt-1 md:pt-2">
          <Star className="h-5 w-5 md:h-6 md:w-6 text-nimo-yellow fill-nimo-yellow" />
          <span className="text-xl md:text-2xl font-bold">{averageRating}</span>
          <span className="text-sm md:text-base text-muted-foreground">({reviews.length} ulasan)</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <Separator className="my-4" />
        <div className="divide-y divide-border">
          {/* --- PERBAIKAN: Gunakan slice() untuk membatasi ulasan yang di-render --- */}
          {reviews.slice(0, visibleReviews).map((review) => (
            <div key={review.id} className="py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-9 md:w-9">
                  <AvatarImage src={review.customer.image || undefined} alt={review.customer.username || review.customer.name || "User"} />
                  <AvatarFallback>
                    {((review.customer.name || review.customer.username || '').charAt(0) || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm md:text-base font-semibold">{review.customer.name || review.customer.username || review.customer.email || "Pengguna Anonim"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={Math.min(5, Math.max(0, review.rating || 0))} />
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground italic">"{review.comment}"</p>
              )}
            </div>
          ))}
        </div>
        {/* --- PERBAIKAN: Tampilkan tombol "Lihat Semua Ulasan" jika ada lebih banyak ulasan --- */}
        {hasMoreReviews && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setVisibleReviews(reviews.length)}
              className="w-full md:w-auto"
            >
              Lihat Semua Ulasan ({reviews.length - visibleReviews})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}