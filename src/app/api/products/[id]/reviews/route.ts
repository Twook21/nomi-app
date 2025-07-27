import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  // PERBAIKAN: Parameter dari URL adalah 'id' sesuai nama folder '[id]'.
  { params }: { params: { id: string } } 
) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer', 'umkm_owner']);
  if (response) return response;

  try {
    const { rating, comment } = await request.json();
    // PERBAIKAN: Ambil 'id' dari params dan ganti namanya menjadi 'productId'.
    const { id: productId } = params; 

    if (!productId) {
      return errorResponse('Product ID is missing from the URL.', 400);
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return errorResponse('Rating must be a number between 1 and 5', 400);
    }

    // Verifikasi apakah customer pernah membeli produk ini
    const hasPurchased = await prisma.order.count({
      where: {
        customerId: user!.userId,
        // Optional: Anda bisa memastikan pesanan sudah selesai (misal: 'delivered')
        // orderStatus: 'delivered', 
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (hasPurchased === 0) {
      return errorResponse('You can only review products you have purchased.', 403);
    }

    // Cek apakah customer sudah pernah memberikan review untuk produk ini
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        customerId: user!.userId,
      },
    });

    if (existingReview) {
      return errorResponse('You have already reviewed this product.', 409);
    }

    // Buat review baru
    const newReview = await prisma.review.create({
      data: {
        // Sekarang productId sudah memiliki nilai yang benar
        productId: productId, 
        customerId: user!.userId,
        rating,
        comment,
      },
    });

    return successResponse({ message: 'Review added successfully', review: newReview }, 201);
  } catch (error: any) {
    // Gunakan params.id untuk logging jika terjadi error sebelum aliasing
    console.error(`Error adding review for product ${params.id}:`, error);
    return errorResponse('Failed to add review', 500, error.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer', 'umkm_owner']);
  if (response) return response;

  try {
    const { rating, comment } = await request.json();
    const { id: productId } = params;

    if (!productId) {
      return errorResponse('Product ID is missing.', 400);
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return errorResponse('Rating must be a number between 1 and 5.', 400);
    }

    // Update ulasan yang cocok dengan productId dan customerId
    const updatedReview = await prisma.review.updateMany({
      where: {
        productId: productId,
        customerId: user!.userId,
      },
      data: {
        rating,
        comment,
      },
    });

    if (updatedReview.count === 0) {
      return errorResponse('Review not found or you do not have permission to edit it.', 404);
    }

    return successResponse({ message: 'Review updated successfully' });
  } catch (error: any) {
    console.error(`Error updating review for product ${params.id}:`, error);
    return errorResponse('Failed to update review', 500, error.message);
  }
}
// GET reviews for a specific product
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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