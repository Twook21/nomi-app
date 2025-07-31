// src/app/api/umkm-owners/me/orders/route.ts
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
        console.error("Authentication error in UMKM orders list API:", error);
        return null;
    }
}

export async function GET(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat daftar pesanan UMKM.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      select: { id: true, isVerified: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const searchParams = request.nextUrl.searchParams;
    const orderStatuses = searchParams.getAll('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      umkmId: umkmOwner.id,
    };

    if (orderStatuses && orderStatuses.length > 0) { 
      where.orderStatus = { in: orderStatuses }; 
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: { id: true, username: true, email: true, phoneNumber: true, name: true, image: true },
        },
        orderItems: {
          include: {
            product: {
              select: { productName: true, imageUrl: true, discountedPrice: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalOrders = await prisma.order.count({ where });

    // --- NEW: Fetch order counts by status for the UMKM ---
    const orderStatusCounts = await prisma.order.groupBy({
        by: ['orderStatus'],
        _count: {
            id: true,
        },
        where: {
            umkmId: umkmOwner.id,
        },
    });

    // Map the counts to a more accessible object
    const counts: { [key: string]: number } = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
    };
    orderStatusCounts.forEach(item => {
        counts[item.orderStatus] = item._count.id;
    });
    // --- END NEW ---

    return successResponse({
      orders: orders.map(order => ({
          ...order,
          customer: {
              ...order.customer,
              username: order.customer?.username || order.customer?.name || 'Pengguna',
              imageUrl: order.customer?.image || null,
              name: order.customer?.name || null,
          },
          orderItems: order.orderItems.map(item => ({
            ...item,
            product: {
              ...item.product,
              imageUrl: item.product.imageUrl || '',
            }
          }))
      })),
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
      orderStatusCounts: counts, // --- NEW: Include order status counts in the response ---
    });

  } catch (error: any) {
    console.error('Error fetching UMKM orders:', error);
    return errorResponse('Failed to fetch UMKM orders', 500, error.message);
  }
}