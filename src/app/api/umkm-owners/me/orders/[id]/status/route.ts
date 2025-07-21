import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  const { id: orderId } = params;
  const { orderStatus } = await request.json();

  if (!orderStatus || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
    return errorResponse('Invalid order status provided', 400);
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
        umkmId: umkmOwner.id, // Pastikan order ini milik UMKM yang login
      },
      data: { orderStatus },
    });

    return successResponse({ message: 'Order status updated successfully', order: updatedOrder });

  } catch (error: any) {
    console.error(`Error updating order ${orderId} status:`, error);
    if (error.code === 'P2025') {
      return errorResponse('Order not found or you do not have permission to update it', 404);
    }
    return errorResponse('Failed to update order status', 500, error.message);
  }
}
