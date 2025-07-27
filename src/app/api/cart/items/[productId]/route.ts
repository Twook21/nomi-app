import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  // PERBAIKAN: Izinkan 'umkm_owner'
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  const { productId } = params;
  const { quantity } = await request.json();

  if (typeof quantity !== "number" || quantity <= 0) {
    return errorResponse("Quantity must be a positive number", 400);
  }

  try {
    let shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
    });

    if (!shoppingCart) {
      shoppingCart = await prisma.shoppingCart.create({
        data: { customerId: user!.userId },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stock: true,
        discountedPrice: true,
        isAvailable: true,
        expirationDate: true,
      },
    });

    if (
      !product ||
      !product.isAvailable ||
      product.expirationDate < new Date()
    ) {
      return errorResponse("Product is not available or has expired", 404);
    }
    if (product.stock < quantity) {
      return errorResponse(
        `Insufficient stock. Only ${product.stock} available.`,
        400
      );
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: shoppingCart.id,
        productId: productId,
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: shoppingCart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return successResponse({ message: "Product added to cart", cartItem });
  } catch (error: any) {
    console.error("Error adding product to cart:", error);
    return errorResponse("Failed to add product to cart", 500, error.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  // PERBAIKAN: Izinkan 'umkm_owner'
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  const { productId } = params;
  const { quantity } = await request.json();

  if (typeof quantity !== "number" || quantity < 0) {
    return errorResponse("Quantity must be a non-negative number", 400);
  }

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
    });

    if (!shoppingCart) {
      return errorResponse("Shopping cart not found", 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, isAvailable: true, expirationDate: true },
    });

    if (
      !product ||
      !product.isAvailable ||
      product.expirationDate < new Date()
    ) {
      return errorResponse("Product is not available or has expired", 404);
    }
    if (product.stock < quantity) {
      return errorResponse(
        `Insufficient stock. Only ${product.stock} available.`,
        400
      );
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: shoppingCart.id,
        productId: productId,
      },
    });

    if (!existingCartItem) {
      return errorResponse("Product not found in cart", 404);
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity },
    });

    return successResponse({
      message: "Cart item quantity updated",
      cartItem: updatedCartItem,
    });
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    return errorResponse(
      "Failed to update cart item quantity",
      500,
      error.message
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  // PERBAIKAN: Izinkan 'umkm_owner'
  const { user, response } = await authenticateAndAuthorize(request, [
    "customer",
    "umkm_owner",
  ]);
  if (response) return response;

  const { productId } = params;

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
    });

    if (!shoppingCart) {
      return errorResponse("Shopping cart not found", 404);
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: shoppingCart.id,
        productId: productId,
      },
    });

    if (!existingCartItem) {
      return errorResponse("Product not found in cart", 404);
    }

    await prisma.cartItem.delete({
      where: { id: existingCartItem.id },
    });

    return successResponse({ message: "Product removed from cart" });
  } catch (error: any) {
    console.error("Error removing product from cart:", error);
    return errorResponse(
      "Failed to remove product from cart",
      500,
      error.message
    );
  }
}
