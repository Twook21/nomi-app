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
        console.error("Authentication error in UMKM order status API:", error);
        return null;
    }
}

export async function PUT(request: NextRequest, { params: rawParams }: { params: { id: string } }) {
  const params = await rawParams; // Await params
  const { id: orderId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa mengubah status pesanan
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk memperbarui status pesanan.");
  }

  const { orderStatus } = await request.json();

  if (!orderStatus || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
    return errorResponse('Invalid order status provided', 400);
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

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
        umkmId: umkmOwner.id, // Pastikan order ini milik UMKM yang login
      },
      data: { orderStatus },
    });

    return successResponse({ message: 'Order status updated successfully', order: updatedOrder });

  } catch (error: any) {
    console.error(`Error updating UMKM order ${orderId} status:`, error);
    if (error.code === 'P2025') {
      return errorResponse('Order not found or you do not have permission to update it', 404);
    }
    return errorResponse('Failed to update order status', 500, error.message);
  }
}