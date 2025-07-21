// app/api/products/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category');
    const umkmId = searchParams.get('umkmId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // Default sort
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // Default order
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const where: any = {
      isAvailable: true,
      expirationDate: {
        gt: new Date(), // Hanya produk yang belum kedaluwarsa
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (umkmId) {
      where.umkmId = umkmId;
    }
    if (minPrice) {
      where.discountedPrice = { ...where.discountedPrice, gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.discountedPrice = { ...where.discountedPrice, lte: parseFloat(maxPrice) };
    }
    if (search) {
      where.productName = {
        contains: search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        umkmOwner: {
          select: {
            id: true,
            umkmName: true,
            umkmAddress: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalProducts = await prisma.product.count({ where });

    return successResponse({
      products,
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
    });

  } catch (error: any) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products', 500, error.message);
  }
}