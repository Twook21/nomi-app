import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;

  if (!productId) {
    return errorResponse("Product ID is required", 400);
  }

  try {
    const totalSold = await prisma.orderItem.count({
      where: {
        productId: productId,
        order: {
          orderStatus: 'delivered', 
        },
      },
    });

    return successResponse({
      totalSold,
    });

  } catch (error: any) {
    console.error(`Error fetching analytics for product ${productId}:`, error.message);
    return successResponse({
      totalSold: 0,
    });
  }
}