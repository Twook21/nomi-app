import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    // Data Statistik
    const totalUsers = await prisma.user.count();
    const totalUmkm = await prisma.uMKMOwner.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    // Data UMKM Menunggu Verifikasi
    const pendingUmkms = await prisma.uMKMOwner.findMany({
      where: { isVerified: false },
      take: 3,
      orderBy: { createdAt: 'asc' },
      select: { id: true, umkmName: true, user: { select: { email: true } } },
    });

    // Data Pesanan Terbaru
    const recentOrders = await prisma.order.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, totalAmount: true, customer: { select: { username: true } } },
    });

    return successResponse({
      stats: { totalUsers, totalUmkm, totalProducts, totalOrders },
      pendingUmkms,
      recentOrders,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch dashboard data', 500, error.message);
  }
}