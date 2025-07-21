import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  try {
    const reviews = await prisma.review.findMany({
      where: { customerId: user!.userId },
      include: {
        product: {
          select: {
            id: true,
            productName: true,
            imageUrl: true,
            umkmOwner: {
              select: { umkmName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(reviews);

  } catch (error: any) {
    console.error('Error fetching user reviews:', error);
    return errorResponse('Failed to fetch user reviews', 500, error.message);
  }
}
