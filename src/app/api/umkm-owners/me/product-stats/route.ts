import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
// import { authenticateAndAuthorize } from '@/lib/auth'; // JWT authenticator
import { getServerSession } from "next-auth/next"; // Import NextAuth
import { authOptions } from "@/lib/auth-config"; // Import NextAuth config

// =========================================================================
// Helper function untuk mendapatkan user ID dan metode autentikasi
// Pindahkan fungsi ini ke lib/auth atau lib/utils untuk reusability
// =========================================================================
// Asumsi fungsi ini sudah ada di lib/auth atau file helper lainnya
// async function getUserAndAuthMethodFromRequest(request: NextRequest) { /* ... */ }
// Jika belum, Anda harus menyertakannya di sini atau mengimpornya.
// Menggunakan versi yang sama seperti di route.ts di atas.
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['umkm_owner', 'admin']);
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

            if (dbUser && (dbUser.role === 'umkm_owner' || dbUser.role === 'admin')) {
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in UMKM product stats API:", error);
        return null;
    }
}
// =========================================================================

export async function GET(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa melihat statistik ini
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat statistik produk.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId }, // Gunakan userId dari authResult
      select: { id: true, isVerified: true }, // Tambahkan isVerified
    });
    if (!umkmOwner) return errorResponse('UMKM profile not found', 404);

    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const products = await prisma.product.findMany({
        where: { umkmId: umkmOwner.id },
        include: {
            reviews: { select: { rating: true } },
            orderItems: {
                where: { order: { orderStatus: 'delivered' } }, // Hanya order items dari order yang delivered
                select: { quantity: true }
            }
        }
    });

    const productsWithStats = products.map(p => {
        const totalSold = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const averageRating = p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
        return { productName: p.productName, totalSold, averageRating };
    });

    // bestSeller hanya dari produk yang punya penjualan > 0
    const bestSeller = [...productsWithStats]
      .filter(p => p.totalSold > 0)
      .sort((a, b) => b.totalSold - a.totalSold)[0] || null;
    
    // highestRated hanya dari produk yang punya rating > 0
    const highestRated = [...productsWithStats]
      .filter(p => p.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)[0] || null;

    return successResponse({ bestSeller, highestRated });
  } catch (error: any) {
    console.error("Error fetching UMKM product stats:", error);
    return errorResponse('Failed to fetch product stats', 500, error.message);
  }
}