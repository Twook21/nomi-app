import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
// import { authenticateAndAuthorize } from "@/lib/auth"; // JWT authenticator
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
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['customer', 'umkm_owner']); // Tetap sertakan peran yang diizinkan untuk JWT
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

            if (dbUser && (dbUser.role === 'customer' || dbUser.role === 'umkm_owner' || dbUser.role === 'admin')) { // Tambahkan validasi role di sini jika NextAuth user selalu ada
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in cart items API:", error);
        return null;
    }
}
// =========================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya customer atau UMKM owner yang boleh menambah ke keranjang
  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse("Forbidden", 403, "Only customers or UMKM owners can add items to cart.");
  }

  const { productId } = params;
  const { quantity } = await request.json();

  if (typeof quantity !== "number" || quantity <= 0) {
    return errorResponse("Quantity must be a positive number", 400);
  }

  try {
    let shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: userId }, // Gunakan userId dari authResult
    });

    if (!shoppingCart) {
      shoppingCart = await prisma.shoppingCart.create({
        data: { customerId: userId }, // Gunakan userId dari authResult
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
    // Periksa apakah stok mencukupi setelah memperhitungkan item yang mungkin sudah ada di keranjang
    const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: shoppingCart.id, productId: productId },
    });
    const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
    if (product.stock < (currentQuantityInCart + quantity)) {
      return errorResponse(
        `Insufficient stock. Only ${product.stock - currentQuantityInCart} more available.`,
        400
      );
    }

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
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya customer atau UMKM owner yang boleh mengupdate keranjang
  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse("Forbidden", 403, "Only customers or UMKM owners can update cart items.");
  }

  const { productId } = params;
  const { quantity } = await request.json();

  if (typeof quantity !== "number" || quantity < 0) {
    return errorResponse("Quantity must be a non-negative number", 400);
  }

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: userId }, // Gunakan userId dari authResult
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
    // Periksa stok setelah update kuantitas
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
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya customer atau UMKM owner yang boleh menghapus dari keranjang
  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse("Forbidden", 403, "Only customers or UMKM owners can remove items from cart.");
  }

  const { productId } = params;

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: userId }, // Gunakan userId dari authResult
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