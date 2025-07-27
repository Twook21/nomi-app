import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Hanya customer (atau umkm yang sedang bertindak sebagai customer) yang bisa membuat pesanan
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  const { shippingAddress, paymentMethod } = await request.json();

  if (!shippingAddress) {
    return errorResponse("Shipping address is required", 400);
  }

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!shoppingCart || shoppingCart.cartItems.length === 0) {
      return errorResponse("Shopping cart is empty", 400);
    }

    let totalAmount = 0;
    const orderItemsData: any[] = [];
    const productsToUpdate: { id: string; stock: number }[] = [];
    const umkmIdsInOrder = new Set<string>();

    for (const item of shoppingCart.cartItems) {
      const product = item.product;

      if (
        !product ||
        !product.isAvailable ||
        product.expirationDate < new Date()
      ) {
        return errorResponse(
          `Product "${
            product?.productName || item.productId
          }" is not available or has expired.`,
          400
        );
      }
      if (product.stock < item.quantity) {
        return errorResponse(
          `Insufficient stock for "${product.productName}". Only ${product.stock} available.`,
          400
        );
      }

      totalAmount += item.quantity * product.discountedPrice.toNumber();
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        pricePerItem: product.discountedPrice,
      });
      productsToUpdate.push({
        id: product.id,
        stock: product.stock - item.quantity,
      });
      umkmIdsInOrder.add(product.umkmId);
    }

    if (umkmIdsInOrder.size > 1) {
      return errorResponse(
        "Orders can only contain products from one UMKM at a time.",
        400
      );
    }
    const umkmId = Array.from(umkmIdsInOrder)[0];

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: user!.userId,
          umkmId: umkmId,
          totalAmount: totalAmount,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod || "Cash on Pickup",
          orderItems: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
      });

      for (const productUpdate of productsToUpdate) {
        await tx.product.update({
          where: { id: productUpdate.id },
          data: { stock: productUpdate.stock },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: shoppingCart.id },
      });

      return newOrder;
    });

    return successResponse(
      { message: "Order created successfully", orderId: order.id },
      201
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return errorResponse("Failed to create order", 500, error.message);
  }
}

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  try {
    const orders = await prisma.order.findMany({
      where: { customerId: user!.userId },
      include: {
        umkmOwner: {
          select: {
            umkmName: true,
            umkmAddress: true,
            umkmPhoneNumber: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: {
                // =================================================================
                // PERUBAHAN: Sertakan data ulasan yang diberikan oleh customer
                // yang sedang login untuk produk ini.
                // =================================================================
                reviews: {
                  where: {
                    customerId: user!.userId,
                  },
                  select: {
                    id: true,
                    rating: true,
                    comment: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(orders);
  } catch (error: any) {
    console.error("Error fetching customer orders:", error);
    return errorResponse("Failed to fetch customer orders", 500, error.message);
  }
}
