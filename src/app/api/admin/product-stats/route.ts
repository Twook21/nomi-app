import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { addDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({ where: { isAvailable: true } });
    
    const nearingExpiryProducts = await prisma.product.count({
      where: {
        isAvailable: true,
        expirationDate: {
          gte: new Date(),
          lte: addDays(new Date(), 7),
        },
      },
    });

    // Kalkulasi Produk Terlaris
    const bestSellerAgg = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1,
    });

    let bestSeller = null;
    if (bestSellerAgg.length > 0) {
      const product = await prisma.product.findUnique({
        where: { id: bestSellerAgg[0].productId },
        select: { productName: true },
      });
      if (product) {
        bestSeller = {
          productName: product.productName,
          totalSold: bestSellerAgg[0]._sum.quantity,
        };
      }
    }

    // Kalkulasi Rating Tertinggi
    const highestRatedAgg = await prisma.review.groupBy({
      by: ['productId'],
      _avg: { rating: true },
      orderBy: { _avg: { rating: 'desc' } },
      take: 1,
    });

    let highestRated = null;
    if (highestRatedAgg.length > 0) {
      const product = await prisma.product.findUnique({
        where: { id: highestRatedAgg[0].productId },
        select: { productName: true },
      });
      if (product) {
        highestRated = {
          productName: product.productName,
          averageRating: highestRatedAgg[0]._avg.rating,
        };
      }
    }

    return successResponse({
      totalProducts,
      activeProducts,
      nearingExpiryProducts,
      bestSeller,
      highestRated,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch product stats', 500, error.message);
  }
}