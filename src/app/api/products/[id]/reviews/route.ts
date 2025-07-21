import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  const { id: productId } = params;
  const { rating, comment } = await request.json();

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return errorResponse('Rating must be a number between 1 and 5', 400);
  }

  try {
    // Pastikan produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Opsional: Pastikan customer sudah membeli produk ini sebelum bisa memberikan review
    const hasPurchased = await prisma.order.count({
      where: {
        customerId: user!.userId,
        orderStatus: 'delivered', // Atau status lain yang menandakan pembelian selesai
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (hasPurchased === 0) {
      return errorResponse('You can only review products you have purchased and received.', 403);
    }

    // Periksa apakah user sudah pernah review produk ini
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        customerId: user!.userId,
      },
    });

    if (existingReview) {
      return errorResponse('You have already reviewed this product. Please update your existing review.', 409);
    }


    const newReview = await prisma.review.create({
      data: {
        productId,
        customerId: user!.userId,
        rating,
        comment,
      },
    });

    return successResponse({ message: 'Review added successfully', review: newReview }, 201);

  } catch (error: any) {
    console.error(`Error adding review for product ${productId}:`, error);
    return errorResponse('Failed to add review', 500, error.message);
  }
}

// GET reviews for a specific product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id: productId } = params;

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        customer: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(reviews);

  } catch (error: any) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return errorResponse('Failed to fetch reviews', 500, error.message);
  }
}
