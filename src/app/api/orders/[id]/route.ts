import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // PERBAIKAN: Izinkan 'umkm_owner' untuk mengakses detail pesanan mereka
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  const { id: orderId } = params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        customerId: user!.userId, // Memastikan hanya pemilik pesanan yang bisa melihat
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
        umkmOwner: {
          select: {
            id: true,
            umkmName: true,
            umkmAddress: true,
            umkmPhoneNumber: true,
            umkmEmail: true,
          },
        },
        customer: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
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
