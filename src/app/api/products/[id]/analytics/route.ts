import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

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
        console.error("Authentication error in product analytics API:", error);
        return null;
    }
}

export async function GET(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } }
) {
  const params = await rawParams;
  const { id: productId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat analitik produk ini.");
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { umkmId: true },
    });

    if (!product) {
      return errorResponse('Produk tidak ditemukan', 404);
    }

    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      select: { id: true, isVerified: true },
    });

    if (!umkmOwner || umkmOwner.id !== product.umkmId) {
      return errorResponse('Anda tidak memiliki izin untuk melihat analitik produk ini', 403);
    }
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const totalSoldResult = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        productId: productId,
        order: {
            umkmId: umkmOwner.id,
            orderStatus: 'delivered'
        }
      },
    });

    const totalSold = totalSoldResult._sum.quantity || 0;

    return successResponse({ totalSold });

  } catch (error: any) {
    console.error(`Error fetching analytics for product ${productId}:`, error);
    return errorResponse('Failed to fetch product analytics', 500, error.message);
  }
}