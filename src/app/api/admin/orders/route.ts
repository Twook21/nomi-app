import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const search = searchParams.get('search');

  try {
    const where: any = {};
    if (status && status !== 'all') {
      where.orderStatus = status;
    }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (search) {
        where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { customer: { username: { contains: search, mode: 'insensitive' } } },
            { umkmOwner: { umkmName: { contains: search, mode: 'insensitive' } } },
        ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { username: true } },
        umkmOwner: { select: { umkmName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(orders);
  } catch (error: any) {
    console.error('Error fetching all orders:', error);
    return errorResponse('Failed to fetch orders', 500, error.message);
  }
}