// LOKASI: app/api/umkm-owners/me/products/[id]/route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

// Helper untuk verifikasi kepemilikan produk (tidak ada perubahan)
async function verifyProductOwner(userId: string, productId: string) {
  const umkmOwner = await prisma.uMKMOwner.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!umkmOwner) {
    return { error: errorResponse('Profil UMKM tidak ditemukan', 404) };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { umkmId: true },
  });

  if (!product) {
    return { error: errorResponse('Produk tidak ditemukan', 404) };
  }

  if (product.umkmId !== umkmOwner.id) {
    return { error: errorResponse('Anda tidak memiliki izin untuk mengakses produk ini', 403) };
  }

  return { umkmOwner, product };
}

// [GET] handler untuk mengambil satu produk (sudah diperbaiki)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  // Verifikasi kepemilikan produk
  const { error: verificationError } = await verifyProductOwner(user!.userId, params.id);
  if (verificationError) return verificationError;

  try {
    // Ambil produk beserta relasi reviews-nya
    const productData = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          select: { rating: true }, // Hanya ambil field rating
        },
        category: {
          select: { categoryName: true },
        },
      },
    });

    if (!productData) {
      return errorResponse("Product not found", 404);
    }

    // Lakukan perhitungan rata-rata rating di backend
    const totalRating = productData.reviews.reduce((acc, review) => acc + review.rating, 0);
    const reviewCount = productData.reviews.length;
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    const { reviews, ...productInfo } = productData;

    // Kirim data produk yang sudah dilengkapi dengan averageRating
    return successResponse({
      ...productInfo,
      averageRating: parseFloat(averageRating.toFixed(1)),
    });

  } catch (e: any) {
    return errorResponse('Gagal mengambil detail produk', 500, e.message);
  }
}

// [PUT] handler untuk memperbarui produk (tidak ada perubahan)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
    if (response) return response;

    const { error } = await verifyProductOwner(user!.userId, params.id);
    if (error) return error;

    try {
        const data = await request.json();
        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                ...data,
                originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
                discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : undefined,
                stock: data.stock ? parseInt(data.stock) : undefined,
                expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
            },
        });
        return successResponse({ message: 'Produk berhasil diperbarui', product: updatedProduct });
    } catch (e: any) {
        return errorResponse('Gagal memperbarui produk', 500, e.message);
    }
}