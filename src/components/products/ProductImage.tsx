"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string | null;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <Image
      // PERBAIKAN: Menggunakan placeholder yang sesuai dengan tema
      src={src || "https://placehold.co/600x600/FBBF24/1E1E1E?text=Nomi"}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
      onError={(e) => {
        // PERBAIKAN: Fallback juga menggunakan placeholder yang sesuai tema
        e.currentTarget.src = "https://placehold.co/600x600/FBBF24/1E1E1E?text=Nomi";
      }}
    />
  );
}
