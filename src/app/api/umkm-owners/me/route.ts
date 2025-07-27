import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });
    if (!umkmOwner) return errorResponse('UMKM profile not found', 404);

    const products = await prisma.product.findMany({
      where: { umkmId: umkmOwner.id },
      include: {
        category: { select: { categoryName: true } },
        reviews: { select: { rating: true } },
        orderItems: { select: { quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = products.map(product => {
        const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const averageRating = product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 0;
        return { ...product, totalSold, averageRating };
    });

    return successResponse({ products: result });
  } catch (error: any) {
    return errorResponse('Failed to fetch UMKM products', 500, error.message);
  }
}