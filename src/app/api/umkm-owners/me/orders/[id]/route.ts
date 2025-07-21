import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  const { id: orderId } = params;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        umkmId: umkmOwner.id, // Pastikan order ini milik UMKM yang login
      },
      include: {
        customer: {
          select: { id: true, username: true, email: true, phoneNumber: true, address: true },
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, productName: true, imageUrl: true, discountedPrice: true },
            },
          },
        },
      },
    });

    if (!order) {
      return errorResponse('Order not found or you do not have permission to view it', 404);
    }

    return successResponse(order);

  } catch (error: any) {
    console.error(`Error fetching UMKM order ${orderId}:`, error);
    return errorResponse('Failed to fetch UMKM order details', 500, error.message);
  }
}
