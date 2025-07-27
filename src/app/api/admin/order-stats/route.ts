import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const ordersToday = await prisma.order.count({
      where: { createdAt: { gte: startOfToday, lte: endOfToday } },
    });

    const revenueToday = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfToday, lte: endOfToday } },
    });

    const pendingOrders = await prisma.order.count({ where: { orderStatus: 'pending' } });
    const totalOrders = await prisma.order.count();

    return successResponse({
      ordersToday,
      revenueToday: revenueToday._sum.totalAmount || 0,
      pendingOrders,
      totalOrders,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch order stats', 500, error.message);
  }
}