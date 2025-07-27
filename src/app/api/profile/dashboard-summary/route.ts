import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  try {
    // 1. Ambil pesanan aktif terakhir
    const recentActiveOrder = await prisma.order.findFirst({
      where: {
        customerId: user!.userId,
        orderStatus: { in: ["pending", "processing", "shipped"] },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, orderStatus: true, totalAmount: true },
    });

    // 2. Ambil produk yang sering dibeli
    const frequentlyPurchasedAgg = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { customerId: user!.userId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productIds = frequentlyPurchasedAgg.map((item) => item.productId);

    const frequentlyPurchased = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        umkmOwner: { select: { umkmName: true } },
      },
    });

    // Urutkan kembali berdasarkan hasil agregasi
    const sortedFrequentlyPurchased = frequentlyPurchased.sort((a, b) => {
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
    });
  } catch (error: any) {
    return errorResponse(
      "Failed to fetch dashboard summary",
      500,
      error.message
    );
  }
}
