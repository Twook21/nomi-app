import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        umkmOwner: {
          select: { id: true, umkmName: true },
        },
        reviews: {
          include: {
            customer: {
              select: {
                username: true,
                name: true,
                image: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Ambil produk lain dari UMKM yang sama, sertakan ulasan mereka
    const otherProductsFromUmkm = await prisma.product.findMany({
      where: {
        umkmId: product.umkmId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        umkmOwner: { select: { umkmName: true } },
        reviews: { // Sertakan ulasan untuk menghitung rata-rata rating
          select: { rating: true }
        },
        // Jika `totalSold` adalah field langsung di model Product, pastikan sudah di-select.
        // Jika `totalSold` perlu dihitung dari OrderItem, itu akan membutuhkan query agregasi terpisah.
        // Untuk saat ini, fokus pada `averageRating` yang terkait dengan "penilaian".
      }
    });

    // Hitung averageRating untuk setiap produk lain
    const otherProductsWithCalculatedData = otherProductsFromUmkm.map(p => {
      const totalRating = p.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = p.reviews.length > 0 ? totalRating / p.reviews.length : 0;

      // Destrukturisasi untuk menghapus properti 'reviews' dari objek sebelum dikirim ke frontend,
      // karena ProductCard tidak menggunakan array ulasan mentah secara langsung.
      const { reviews, ...rest } = p;

      return {
        ...rest,
        averageRating: parseFloat(averageRating.toFixed(1)), // Format ke satu desimal
        // Jika `totalSold` juga perlu dihitung dari jumlah ulasan (meskipun ini biasanya untuk penjualan):
        // totalSold: reviews.length,
        // Jika `totalSold` adalah field yang ada di `rest` (dari database), maka tidak perlu diubah di sini.
      };
    });

    return successResponse({
      product,
      otherProducts: otherProductsWithCalculatedData,
    });

  } catch (error: any) {
    return errorResponse('Failed to fetch product details', 500, error.message);
  }
}
