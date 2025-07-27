import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const totalCategories = await prisma.foodCategory.count();

    const mostPopularCategory = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 1,
    });

    let popularCategoryName = null;
    if (mostPopularCategory.length > 0 && mostPopularCategory[0].categoryId) {
      const category = await prisma.foodCategory.findUnique({
        where: { id: mostPopularCategory[0].categoryId },
        select: { categoryName: true },
      });
      popularCategoryName = category?.categoryName;
    }

    const emptyCategories = await prisma.foodCategory.count({
        where: {
            products: {
                none: {}
            }
        }
    });

    return successResponse({
      totalCategories,
      popularCategoryName,
      emptyCategories,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch category stats', 500, error.message);
  }
}