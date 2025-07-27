import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, [
    "umkm_owner",
  ]);
  if (response) return response;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse("UMKM profile not found", 404);
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // 1. Statistik Utama
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { umkmId: umkmOwner.id },
    });
    const totalOrders = await prisma.order.count({
      where: { umkmId: umkmOwner.id },
    });
    const activeProducts = await prisma.product.count({
      where: { umkmId: umkmOwner.id, isAvailable: true },
    });
    const currentMonthRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        umkmId: umkmOwner.id,
        createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
      },
    });

    // 2. Data Omset 6 Bulan Terakhir
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));
    const monthlyOrders = await prisma.order.findMany({
      where: { umkmId: umkmOwner.id, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, totalAmount: true },
    });

    const turnoverByMonth: { [key: string]: number } = {};
    monthlyOrders.forEach((order) => {
      const month = format(order.createdAt, "MMM yyyy");
      if (!turnoverByMonth[month]) turnoverByMonth[month] = 0;
      turnoverByMonth[month] += Number(order.totalAmount);
    });

    const monthlyTurnover = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, i);
      const month = format(date, "MMM yyyy");
      return {
        month: format(date, "MMM"),
        omset: turnoverByMonth[month] || 0,
      };
    }).reverse();

    // 3. Pesanan Terbaru & Produk Terlaris
    const recentOrders = await prisma.order.findMany({
      where: { umkmId: umkmOwner.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalAmount: true,
        customer: { select: { username: true } },
      },
    });
    const productsWithReviews = await prisma.product.findMany({
      where: { umkmId: umkmOwner.id },
      include: {
        reviews: { select: { rating: true } },
        orderItems: { select: { quantity: true } },
      },
    });
    const productsWithStats = productsWithReviews.map((p) => ({
      id: p.id,
      productName: p.productName,
      totalSold: p.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      averageRating:
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0,
    }));
    const bestSellers = [...productsWithStats]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
    const highestRated =
      [...productsWithStats].sort(
        (a, b) => b.averageRating - a.averageRating
      )[0] || null;

    return successResponse({
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        currentMonthRevenue: currentMonthRevenue._sum.totalAmount || 0,
        totalOrders,
        activeProducts,
      },
      monthlyTurnover,
      recentOrders,
      bestSellers,
      highestRated,
    });
  } catch (error: any) {
    return errorResponse(
      "Failed to fetch dashboard summary",
      500,
      error.message
    );
  }
}
