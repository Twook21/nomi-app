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
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['customer', 'umkm_owner', 'admin']);
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

        if (dbUser && (dbUser.role === 'customer' || dbUser.role === 'umkm_owner' || dbUser.role === 'admin')) {
            return {
                userId: dbUser.id,
                method: 'nextauth' as const,
                userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
            };
        }
    }

    return null;
  } catch (error) {
    console.error("Authentication error in cart API:", error);
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

  // Otorisasi: Hanya customer atau UMKM owner yang boleh melihat keranjang mereka
  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse("Forbidden", 403, "You do not have permission to view this cart.");
  }

  const { searchParams } = new URL(request.url);
  const countOnly = searchParams.get('countOnly') === 'true';

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: userId }, // Gunakan userId dari authResult
      include: {
        _count: {
            select: { cartItems: true }
        },
        // Hanya include item jika tidak hanya mengambil jumlah
        ...(!countOnly && {
            cartItems: {
              include: {
                product: {
                  select: { id: true, productName: true, discountedPrice: true, stock: true, imageUrl: true },
                },
              },
            },
        })
      },
    });

    if (countOnly) {
        return successResponse({ itemCount: shoppingCart?._count.cartItems ?? 0 });
    }

    if (!shoppingCart) {
      // Jika tidak ada shopping cart, buat yang baru dan kembalikan itu
      const newCart = await prisma.shoppingCart.create({
        data: { customerId: userId }, // Gunakan userId dari authResult
        include: { _count: { select: { cartItems: true } }, cartItems: true }, // Pastikan _count juga di-include
      });
      return successResponse(newCart);
    }

    return successResponse(shoppingCart);

  } catch (error: any) {
    console.error("Error fetching shopping cart:", error);
    return errorResponse('Failed to fetch shopping cart', 500, error.message);
  }
}