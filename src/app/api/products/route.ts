// src/app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const umkmId = searchParams.get('umkmId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const where: any = {
      isAvailable: true,
      expirationDate: {
        gt: new Date(),
      },
    };

    // --- PERBAIKAN DI SINI: MENCARI ID KATEGORI DARI SLUG ---
    if (categorySlug) {
      // 1. Ganti hyphen dengan spasi
      const categoryNameWithSpaces = categorySlug.replace(/-/g, ' ');
      // 2. Ubah menjadi Title Case
      const categoryName = categoryNameWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const categoryRecord = await prisma.foodCategory.findFirst({
        where: { categoryName: categoryName },
        select: { id: true },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      } else {
        return successResponse({
          products: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        });
      }
    }
    // --- AKHIR PERBAIKAN ---

    if (umkmId) where.umkmId = umkmId;
    if (minPrice) where.discountedPrice = { ...where.discountedPrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.discountedPrice = { ...where.discountedPrice, lte: parseFloat(maxPrice) };
    if (search) {
      where.productName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const validSortByFields = ['createdAt', 'productName', 'discountedPrice', 'stock'];
    const finalSortBy = validSortByFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'desc';

    const productsData = await prisma.product.findMany({
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
        reviews: {
          select: {
            rating: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        [finalSortBy]: finalSortOrder as 'asc' | 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const products = productsData.map(p => {
      const totalSold = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const averageRating = p.reviews.length > 0
        ? parseFloat((p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length).toFixed(1))
        : 0;

      const { reviews, orderItems, ...productData } = p;

      return {
        ...productData,
        description: productData.description || '',
        imageUrl: productData.imageUrl || 'https://placehold.co/600x400',
        totalSold,
        averageRating,
        umkmOwner: {
            id: productData.umkmOwner.id,
            umkmName: productData.umkmOwner.umkmName,
            umkmAddress: productData.umkmOwner.umkmAddress,
        },
        category: productData.category ? { categoryName: productData.category.categoryName } : null,
        reviews: [],
      };
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