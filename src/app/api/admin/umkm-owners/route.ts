// src/app/api/admin/umkm-owners/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// Helper untuk mendapatkan user ID dari request (support dual auth)
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['admin']);
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

            if (dbUser && dbUser.role === 'admin') {
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in admin UMKM API:", error);
        return null;
    }
}

export async function GET(request: NextRequest) {
  // Support dual authentication
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Admin authentication required.");
  }

  const { userRole } = authResult;

  // Only admin can access
  if (userRole !== 'admin') {
    return errorResponse('Forbidden', 403, 'Only admin can access UMKM data.');
  }

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
          select: { 
            id: true,
            username: true, 
            email: true,
            role: true 
          },
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
        umkmAddress: umkm.umkmAddress,
        isVerified: umkm.isVerified,
        createdAt: umkm.createdAt,
        user: umkm.user,
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