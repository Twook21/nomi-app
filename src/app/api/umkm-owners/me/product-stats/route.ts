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
            reviews: { select: { rating: true } },
            orderItems: { select: { quantity: true } }
        }
    });

    const productsWithStats = products.map(p => {
        const totalSold = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const averageRating = p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
        return { productName: p.productName, totalSold, averageRating };
    });

    const bestSeller = [...productsWithStats].sort((a, b) => b.totalSold - a.totalSold)[0] || null;
    const highestRated = [...productsWithStats].sort((a, b) => b.averageRating - a.averageRating)[0] || null;

    return successResponse({ bestSeller, highestRated });
  } catch (error: any) {
    return errorResponse('Failed to fetch product stats', 500, error.message);
  }
}