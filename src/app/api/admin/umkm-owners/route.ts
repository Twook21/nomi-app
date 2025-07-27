import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const searchParams = request.nextUrl.searchParams;
  const isVerified = searchParams.get('isVerified');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    const where: any = {};
    if (isVerified !== null && isVerified !== 'all') {
      where.isVerified = isVerified === 'true';
    }
    if (search) {
      where.OR = [
        { umkmName: { contains: search, mode: 'insensitive' } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const umkmOwners = await prisma.uMKMOwner.findMany({
      where,
      include: {
        user: {
          select: { username: true, email: true },
        },
        products: {
          include: {
            reviews: { select: { rating: true } },
          },
        },
        orders: {
          select: { totalAmount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Proses data untuk menambahkan analitik
    let result = umkmOwners.map(umkm => {
      const totalTurnover = umkm.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      
      const allReviews = umkm.products.flatMap(p => p.reviews);
      const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

      return {
        id: umkm.id,
        umkmName: umkm.umkmName,
        isVerified: umkm.isVerified,
        createdAt: umkm.createdAt,
        user: umkm.user,
        umkmAddress: umkm.umkmAddress,
        totalTurnover,
        averageRating,
      };
    });

    // Lakukan sorting di server setelah data analitik dihitung
    if (sortBy === 'totalTurnover') {
      result.sort((a, b) => b.totalTurnover - a.totalTurnover);
    } else if (sortBy === 'averageRating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    return successResponse(result);

  } catch (error: any) {
    console.error('Error fetching UMKM owners:', error);
    return errorResponse('Failed to fetch UMKM owners', 500, error.message);
  }
}