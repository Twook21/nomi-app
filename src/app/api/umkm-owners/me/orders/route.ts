import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const searchParams = request.nextUrl.searchParams;
    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      umkmId: umkmOwner.id,
    };

    if (orderStatus) {
      where.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: { id: true, username: true, email: true, phoneNumber: true },
        },
        orderItems: {
          include: {
            product: {
              select: { productName: true, imageUrl: true, discountedPrice: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalOrders = await prisma.order.count({ where });

    return successResponse({
      orders,
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    });

  } catch (error: any) {
    console.error('Error fetching UMKM orders:', error);
    return errorResponse('Failed to fetch UMKM orders', 500, error.message);
  }
}
