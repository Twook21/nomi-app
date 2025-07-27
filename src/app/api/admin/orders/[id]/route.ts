import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { username: true, email: true, phoneNumber: true } },
        umkmOwner: { select: { umkmName: true, umkmEmail: true, umkmPhoneNumber: true } },
        orderItems: {
          include: {
            product: { select: { id: true, productName: true, imageUrl: true } },
          },
        },
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order);
  } catch (error: any) {
    return errorResponse('Failed to fetch order details', 500, error.message);
  }
}