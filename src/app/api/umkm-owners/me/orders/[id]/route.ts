import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// Helper function to get user ID and auth method (assuming it's reusable)
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
        console.error("Authentication error in UMKM order detail API:", error);
        return null;
    }
}

export async function GET(request: NextRequest, { params: rawParams }: { params: { id: string } }) {
  const params = await rawParams; // Await params
  const { id: orderId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa melihat detail pesanan
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat detail pesanan UMKM.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      select: { id: true, isVerified: true }, // Ambil isVerified
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }
    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        umkmId: umkmOwner.id, // Pastikan order ini milik UMKM yang login
      },
      include: {
        customer: {
          select: { id: true, username: true, email: true, phoneNumber: true, address: true, name: true, image: true }, // Tambah name dan image
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, productName: true, imageUrl: true, discountedPrice: true, stock: true }, // Tambah stock
            },
          },
        },
      },
    });

    if (!order) {
      return errorResponse('Order not found or you do not have permission to view it', 404);
    }

    // Transformasi untuk fallback data customer dan product
    const transformedOrder = {
        ...order,
        customer: {
            ...order.customer,
            username: order.customer?.username || order.customer?.name || 'Pengguna', // Fallback username
            imageUrl: order.customer?.image || null, // Ensure imageUrl is null if undefined
            name: order.customer?.name || null, // Ensure name is null if undefined
        },
        orderItems: order.orderItems.map(item => ({
            ...item,
            product: {
                ...item.product,
                imageUrl: item.product.imageUrl || '', // Fallback product imageUrl
            }
        }))
    };

    return successResponse(transformedOrder);

  } catch (error: any) {
    console.error(`Error fetching UMKM order ${orderId}:`, error);
    return errorResponse('Failed to fetch UMKM order details', 500, error.message);
  }
}