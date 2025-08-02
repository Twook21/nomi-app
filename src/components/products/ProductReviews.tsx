"use client";

import type { Review } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
        className={`h-4 w-4 ${i < rating ? 'text-nimo-yellow fill-nimo-yellow' : 'text-muted-foreground/50'}`} 
      />
    ))}
  </div>
);

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada ulasan untuk produk ini.
      </div>
    );
  }

  const validReviews = reviews.filter(review => typeof review.rating === 'number' && review.rating >= 0 && review.rating <= 5);

  const averageRating = validReviews.length > 0 
    ? (validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length).toFixed(1) 
    : '0.0';

  return (
    <Card className="bg-[var(--nimo-light)] dark:bg-card border-border/50">
      <CardHeader>
        <CardTitle>Ulasan Pelanggan</CardTitle>
        <div className="flex items-center gap-2 pt-2">
          <Star className="h-6 w-6 text-nimo-yellow fill-nimo-yellow" />
          <span className="text-2xl font-bold">{averageRating}</span>
          <span className="text-muted-foreground">({reviews.length} ulasan)</span>
        </div>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div key={review.id} className="py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={review.customer.image || undefined} alt={review.customer.username || review.customer.name || "User"} />
                  {/* PERBAIKAN: Pastikan string tidak null sebelum charAt */}
                  <AvatarFallback>
                    {((review.customer.name || review.customer.username || '').charAt(0) || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.customer.name || review.customer.username || review.customer.email || "Pengguna Anonim"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={Math.min(5, Math.max(0, review.rating || 0))} />
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-muted-foreground italic">"{review.comment}"</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}