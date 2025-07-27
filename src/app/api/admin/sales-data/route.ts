import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    const salesByDay: { [key: string]: number } = {
      'Min': 0, 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0
    };
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    orders.forEach(order => {
      const dayName = dayNames[order.createdAt.getDay()];
      salesByDay[dayName] += Number(order.totalAmount);
    });

    const salesData = dayNames.map(name => ({
      name,
      total: salesByDay[name],
    }));

    return successResponse(salesData);
  } catch (error: any) {
    return errorResponse('Failed to fetch sales data', 500, error.message);
  }
}