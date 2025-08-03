"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string | null;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <Image
      src={src || "https://placehold.co/600x600/FBBF24/1E1E1E?text=Nomi"}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
      onError={(e) => {
        e.currentTarget.src = "https://placehold.co/600x600/FBBF24/1E1E1E?text=Nomi";
      }}
    />
  );
}
