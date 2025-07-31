import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
// import { authenticateAndAuthorize } from "@/lib/auth"; // JWT authenticator
import { getServerSession } from "next-auth/next"; // Import NextAuth
import { authOptions } from "@/lib/auth-config"; // Import NextAuth config
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

// =========================================================================
// Helper function untuk mendapatkan user ID dan metode autentikasi
// Pindahkan fungsi ini ke lib/auth atau lib/utils untuk reusability
// =========================================================================
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['umkm_owner', 'admin']); // Hanya UMKM owner atau admin
            if (user) {
                return {
                    userId: user.userId,
                    method: 'jwt' as const,
                    userRole: user.role as 'customer' | 'umkm_owner' | 'admin'
                };
            }
        }

        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    role: true,
                },
            });

            if (dbUser && (dbUser.role === 'umkm_owner' || dbUser.role === 'admin')) { // Hanya UMKM owner atau admin
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in UMKM dashboard API:", error);
        return null;
    }
}
// =========================================================================

export async function GET(request: NextRequest) {
  // Gunakan helper baru untuk mendapatkan user ID dan metode auth
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa mengakses dashboard ini
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat dasbor UMKM.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId }, // Gunakan userId dari authResult
      select: { id: true, isVerified: true }, // Ambil isVerified juga
    });

    if (!umkmOwner) {
      return errorResponse("UMKM profile not found for this user.", 404);
    }

    // Jika UMKM belum terverifikasi, mungkin Anda ingin mengembalikan data terbatas atau pesan khusus
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // 1. Statistik Utama
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { umkmId: umkmOwner.id, orderStatus: 'delivered' }, // Hanya order yang delivered
    });
    const totalOrders = await prisma.order.count({
      where: { umkmId: umkmOwner.id, orderStatus: 'delivered' }, // Hanya order yang delivered
    });
    const activeProducts = await prisma.product.count({
      where: {
        umkmId: umkmOwner.id,
        isAvailable: true,
        expirationDate: { gt: new Date() } // Hanya produk yang aktif dan belum kedaluwarsa
      },
    });
    const currentMonthRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        umkmId: umkmOwner.id,
        createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        orderStatus: 'delivered', // Hanya order yang delivered
      },
    });

    // 2. Data Omset 6 Bulan Terakhir
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));
    const monthlyOrders = await prisma.order.findMany({
      where: {
        umkmId: umkmOwner.id,
        createdAt: { gte: sixMonthsAgo },
        orderStatus: 'delivered' // Hanya order yang delivered
      },
      select: { createdAt: true, totalAmount: true },
    });

    const turnoverByMonth: { [key: string]: number } = {};
    // Inisialisasi untuk 6 bulan terakhir agar grafik selalu memiliki 6 titik
    for (let i = 0; i < 6; i++) {
        const date = subMonths(now, i);
        const monthKey = format(date, "MMM yyyy");
        turnoverByMonth[monthKey] = 0; // Inisialisasi dengan 0
    }

    monthlyOrders.forEach((order) => {
      const month = format(order.createdAt, "MMM yyyy");
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
      where: { umkmId: umkmOwner.id, orderStatus: 'delivered' }, // Hanya order yang delivered
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalAmount: true,
        customer: { select: { username: true, name: true } }, // Tambahkan name customer
      },
    });
    
    const productsWithReviewsAndOrders = await prisma.product.findMany({
      where: { umkmId: umkmOwner.id },
      include: {
        reviews: { select: { rating: true } },
        orderItems: {
            where: { order: { orderStatus: 'delivered' } }, // Hanya order items dari order yang delivered
            select: { quantity: true }
        },
      },
    });

    const productsWithStats = productsWithReviewsAndOrders.map((p) => ({
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

    // Filter highestRated hanya dari produk yang punya rating > 0
    const highestRated =
      [...productsWithStats]
        .filter(p => p.averageRating > 0) // Hanya produk dengan rating > 0
        .sort((a, b) => b.averageRating - a.averageRating
      )[0] || null;

    return successResponse({
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        currentMonthRevenue: currentMonthRevenue._sum.totalAmount || 0,
        totalOrders,
        activeProducts,
      },
      monthlyTurnover,
      recentOrders: recentOrders.map(o => ({ // Map recentOrders untuk memastikan username/name
          ...o,
          customer: { username: o.customer?.username || o.customer?.name || 'Pengguna' }
      })),
      bestSellers,
      highestRated,
    });
  } catch (error: any) {
    console.error("Error fetching UMKM dashboard summary:", error);
    return errorResponse(
      "Failed to fetch dashboard summary",
      500,
      error.message
    );
  }
}