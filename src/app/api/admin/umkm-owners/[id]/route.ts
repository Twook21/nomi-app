import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { subMonths, format, differenceInDays, addDays } from 'date-fns';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (startDate) dateFilter.gte = new Date(startDate);
  if (endDate) dateFilter.lte = new Date(endDate);

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { username: true, email: true, createdAt: true } },
      },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM partner not found', 404);
    }

    // Ambil semua produk milik UMKM ini
    const allProducts = await prisma.product.findMany({
        where: { umkmId: params.id },
        include: {
            reviews: { select: { rating: true } },
            orderItems: { where: { order: { createdAt: dateFilter } }, select: { quantity: true, order: { select: { createdAt: true } } } },
        }
    });

    let foodSavedCount = 0;
    const productsWithStats = allProducts.map(product => {
        const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const averageRating = product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;
        
        // Hitung produk terselamatkan (terjual dalam 7 hari sebelum kedaluwarsa)
        product.orderItems.forEach(item => {
            const daysUntilExpiry = differenceInDays(product.expirationDate, item.order.createdAt);
            if (daysUntilExpiry >= 0 && daysUntilExpiry <= 7) {
                foodSavedCount += item.quantity;
            }
        });

        return {
          id: product.id,
          productName: product.productName,
          stock: product.stock,
          isAvailable: product.isAvailable,
          totalSold,
          averageRating,
        };
      });

    const bestSeller = productsWithStats.sort((a, b) => b.totalSold - a.totalSold)[0] || null;

    const stats = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true },
        where: { umkmId: params.id, createdAt: dateFilter }
    });
    
    const recentOrders = await prisma.order.findMany({
        where: { umkmId: params.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, totalAmount: true, customer: { select: { username: true } } }
    });

    // Kalkulasi omset 6 bulan terakhir
    const sixMonthsAgo = subMonths(new Date(), 5);
    sixMonthsAgo.setDate(1);
    const monthlyOrders = await prisma.order.findMany({
        where: { umkmId: params.id, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, totalAmount: true }
    });

    const turnoverByMonth: { [key: string]: number } = {};
    monthlyOrders.forEach(order => {
        const month = format(order.createdAt, 'MMM yyyy');
        if (!turnoverByMonth[month]) turnoverByMonth[month] = 0;
        turnoverByMonth[month] += Number(order.totalAmount);
    });
    
    const monthlyTurnover = Object.keys(turnoverByMonth).map(month => ({
        month,
        omset: turnoverByMonth[month]
    }));

    // Kalkulasi analitik harian
    const daysInRange = (dateFilter.gte && dateFilter.lte) ? differenceInDays(dateFilter.lte, dateFilter.gte) + 1 : 1;
    const totalRevenue = Number(stats._sum.totalAmount || 0);
    const totalOrders = stats._count.id || 0;

    const result = {
        ...umkmOwner,
        products: productsWithStats,
        stats: {
            totalRevenue,
            totalOrders,
            totalProducts: allProducts.length,
            averageDailyRevenue: totalRevenue / daysInRange,
            averageDailyOrders: totalOrders / daysInRange,
            foodSaved: foodSavedCount,
        },
        monthlyTurnover,
        bestSeller,
        recentOrders,
    };

    return successResponse(result);
  } catch (error: any) {
    return errorResponse('Failed to fetch UMKM partner details', 500, error.message);
  }
}