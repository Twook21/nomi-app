import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const isAvailable = searchParams.get('isAvailable');
  const search = searchParams.get('search');

  try {
    const where: any = {};
    if (isAvailable !== null && isAvailable !== 'all') {
      where.isAvailable = isAvailable === 'true';
    }
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { umkmOwner: { umkmName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        umkmOwner: { select: { umkmName: true } },
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
      
      return {
        ...product,
        totalSold,
        averageRating,
      };
    });

    return successResponse(result);
  } catch (error: any) {
    return errorResponse('Failed to fetch products', 500, error.message);
  }
}