import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const totalUsers = await prisma.user.count();
    const totalUmkm = await prisma.uMKMOwner.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    return successResponse({
      totalUsers,
      totalUmkm,
      totalProducts,
      totalOrders,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch stats', 500, error.message);
  }
}