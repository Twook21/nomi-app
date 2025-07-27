import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const topProducts = await prisma.review.groupBy({
      by: ['productId'],
      _avg: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: 'desc',
        },
      },
      take: 5,
    });

    const productIds = topProducts.map(p => p.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, productName: true, umkmOwner: { select: { umkmName: true } } }
    });
    
    const result = products.map(product => {
        const reviewData = topProducts.find(p => p.productId === product.id);
        return {
            ...product,
            averageRating: reviewData?._avg.rating || 0
        }
    }).sort((a, b) => b.averageRating - a.averageRating);


    return successResponse(result);
  } catch (error: any) {
    return errorResponse('Failed to fetch top products', 500, error.message);
  }
}