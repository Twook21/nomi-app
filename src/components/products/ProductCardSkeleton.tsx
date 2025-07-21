/*
================================================================================
File: src/components/products/ProductCardSkeleton.tsx (NEW FILE)
Description: Komponen untuk menampilkan UI kerangka (skeleton) saat
data produk sedang dimuat. Ini memberikan UX yang lebih baik.
================================================================================
*/
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
      </CardContent>
    </Card>
  );
}
