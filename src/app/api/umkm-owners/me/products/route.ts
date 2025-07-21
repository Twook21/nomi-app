// app/api/umkm-owners/me/products/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    // Ambil ID UMKM dari user yang login
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const searchParams = request.nextUrl.searchParams;
    const isAvailable = searchParams.get('isAvailable');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      umkmId: umkmOwner.id,
    };

    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { categoryName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
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
    console.error('Error fetching UMKM products:', error);
    return errorResponse('Failed to fetch UMKM products', 500, error.message);
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    const {
      productName,
      description,
      originalPrice,
      discountedPrice,
      stock,
      expirationDate,
      imageUrl,
      categoryId,
    } = await request.json();

    if (!productName || !originalPrice || !discountedPrice || stock === undefined || !expirationDate) {
      return errorResponse('Missing required product fields', 400);
    }

    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const newProduct = await prisma.product.create({
      data: {
        umkmId: umkmOwner.id,
        productName,
        description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        stock: parseInt(stock),
        expirationDate: new Date(expirationDate),
        imageUrl,
        categoryId,
      },
    });

    return successResponse({ message: 'Product added successfully', product: newProduct }, 201);

  } catch (error: any) {
    console.error('Error adding product:', error);
    return errorResponse('Failed to add product', 500, error.message);
  }
}