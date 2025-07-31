import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config"; // Assuming you have NextAuth config
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

// Helper function to get user ID from different auth methods
async function getUserFromRequest(request: NextRequest) {
  try {
    // Try JWT authentication first
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { user } = await authenticateAndAuthorize(request, [
        "customer",
        "umkm_owner",
      ]);
      if (user) {
        return {
          userId: user.userId,
          method: "jwt" as const,
          user,
        };
      }
    }

    // Try NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user) {
      // Find user in database by email (NextAuth identifier)
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: {
          id: true,
          email: true,
          role: true,
          username: true,
          name: true,
        },
      });

      if (
        dbUser &&
        (dbUser.role === "customer" || dbUser.role === "umkm_owner")
      ) {
        return {
          userId: dbUser.id,
          method: "nextauth" as const,
          user: {
            userId: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            username: dbUser.username,
            name: dbUser.name,
          },
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authResult = await getUserFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required");
  }

  const { userId, method } = authResult;

  try {
    // 1. Ambil pesanan aktif terakhir
    const recentActiveOrder = await prisma.order.findFirst({
      where: {
        customerId: userId,
        orderStatus: { in: ["pending", "processing", "shipped"] },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, orderStatus: true, totalAmount: true },
    });

    // 2. Ambil produk yang sering dibeli dengan data lengkap
    const frequentlyPurchasedAgg = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { customerId: userId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productIds = frequentlyPurchasedAgg.map((item) => item.productId);

    const frequentlyPurchased = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        umkmOwner: { select: { umkmName: true } },
        category: { select: { categoryName: true } }, // Tambah category
        // Ambil reviews untuk menghitung rating
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: {
              select: {
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        // Ambil order items untuk menghitung total sold
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // Transform data untuk mencocokkan interface Product
    const transformedProducts = frequentlyPurchased.map((product) => {
      const totalSold = product.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        id: product.id,
        productName: product.productName,
        description: product.description,
        originalPrice: product.originalPrice.toNumber(), // <-- FIXED
        discountedPrice: product.discountedPrice.toNumber(), // <-- FIXED
        stock: product.stock,
        imageUrl: product.imageUrl,
        expirationDate: product.expirationDate.toISOString(),
        isAvailable: product.isAvailable,
        categoryId: product.categoryId,
        umkmOwner: product.umkmOwner,
        category: product.category,
        totalSold,
        averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        reviews: product.reviews.map((review) => ({
          ...review,
          createdAt: review.createdAt.toISOString(),
        })),
      };
    });

    // Urutkan kembali berdasarkan hasil agregasi
    const sortedFrequentlyPurchased = transformedProducts.sort((a, b) => {
      const countA =
        frequentlyPurchasedAgg.find((p) => p.productId === a.id)?._sum
          .quantity || 0;
      const countB =
        frequentlyPurchasedAgg.find((p) => p.productId === b.id)?._sum
          .quantity || 0;
      return countB - countA;
    });

    return successResponse({
      recentActiveOrder,
      frequentlyPurchased: sortedFrequentlyPurchased,
      authMethod: method,
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return errorResponse(
      "Failed to fetch dashboard summary",
      500,
      error.message
    );
  }
}
