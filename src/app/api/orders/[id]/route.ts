// src/app/api/orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
// import { authenticateAndAuthorize } from "@/lib/auth"; // Ini adalah JWT authenticator Anda
import { getServerSession } from "next-auth/next"; // Import NextAuth
import { authOptions } from "@/lib/auth-config"; // Import NextAuth config

// =========================================================================
// Helper function untuk mendapatkan user ID dan metode autentikasi
// Pindahkan fungsi ini ke lib/auth atau lib/utils untuk reusability
// =========================================================================
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        // 1. Coba JWT authentication (dari header Authorization)
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            // Anda perlu pastikan authenticateAndAuthorize mengembalikan objek user
            // yang memiliki userId dan role, atau sesuaikan panggilannya.
            // Untuk route ini, user hanya perlu terautentikasi.
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['customer', 'umkm_owner', 'admin']);
            if (user) {
                return {
                    userId: user.userId,
                    method: 'jwt' as const,
                    userRole: user.role as 'customer' | 'umkm_owner' | 'admin'
                };
            }
        }

        // 2. Coba NextAuth session (dari cookie)
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    role: true,
                },
            });

            if (dbUser) {
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null; // Tidak ada metode otentikasi yang valid ditemukan
    } catch (error) {
        console.error("Authentication error in orders/[id] API:", error);
        return null;
    }
}
// =========================================================================

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Gunakan helper baru untuk mendapatkan user ID dan metode auth
    const authResult = await getUserAndAuthMethodFromRequest(request);

    if (!authResult) {
        return errorResponse("Unauthorized", 401, "Authentication required.");
    }

    const { userId, userRole } = authResult; // Dapatkan userId dan userRole

    const { id: orderId } = params;

    try {
        // Perbaikan: Tambahkan OR condition untuk umkmId agar UMKM owner bisa melihat order mereka
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                OR: [
                    { customerId: userId }, // Customer bisa melihat pesanan mereka
                    { umkmId: userId }      // UMKM owner bisa melihat pesanan yang dibuat untuk UMKM mereka
                ]
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                productName: true,
                                imageUrl: true,
                                discountedPrice: true,
                            },
                        },
                    },
                },
                umkmOwner: { // Include data UMKM owner yang terkait dengan pesanan
                    select: {
                        id: true,
                        umkmName: true,
                        umkmAddress: true,
                        umkmPhoneNumber: true,
                        umkmEmail: true,
                    },
                },
                customer: { // Include data customer yang terkait dengan pesanan
                    select: {
                        username: true,
                        email: true,
                        name: true, // Tambahkan name
                        phoneNumber: true, // Tambahkan phone number
                        address: true, // Tambahkan address
                    },
                },
            },
        });

        // Otorisasi lebih lanjut: Pastikan user yang login adalah customer ATAU umkmOwner dari order tersebut
        if (!order || (userRole === "customer" && order.customerId !== userId) || (userRole === "umkm_owner" && order.umkmId !== userId)) {
             return errorResponse(
                "Order not found or you do not have permission to view it",
                404
            );
        }

        return successResponse(order);
    } catch (error: any) {
        console.error(`Error fetching order ${orderId}:`, error);
        return errorResponse("Failed to fetch order details", 500, error.message);
    }
}