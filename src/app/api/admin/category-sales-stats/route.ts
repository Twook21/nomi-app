import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const categorySales = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
    });

    const products = await prisma.product.findMany({
      where: {
        id: { in: categorySales.map(cs => cs.productId) }
      },
      select: {
        id: true,
        categoryId: true,
        category: { select: { categoryName: true } }
      }
    });

    const salesByCategory: { [key: string]: number } = {};

    for (const sale of categorySales) {
      const product = products.find(p => p.id === sale.productId);
      if (product && product.category) {
        const categoryName = product.category.categoryName;
        if (!salesByCategory[categoryName]) {
          salesByCategory[categoryName] = 0;
        }
        salesByCategory[categoryName] += sale._sum.quantity || 0;
      }
    }

    const result = Object.keys(salesByCategory).map(name => ({
      name,
      value: salesByCategory[name],
    }));

    return successResponse(result);
  } catch (error: any) {
    return errorResponse('Failed to fetch category sales stats', 500, error.message);
  }
}