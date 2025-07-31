// src/app/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server"; // Import NextResponse
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth"; // Ini adalah JWT authenticator Anda
import { getServerSession } from "next-auth/next"; // Import NextAuth
import { authOptions } from "@/lib/auth-config"; // Import NextAuth config

// =========================================================================
// Helper function untuk mendapatkan user ID dan metode autentikasi
// SANGAT DISARANKAN untuk memindahkan fungsi ini ke lib/auth atau lib/utils
// agar bisa dipakai di seluruh API routes yang membutuhkan dual auth.
// =========================================================================
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        // 1. Coba JWT authentication (dari header Authorization)
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            // authenticateAndAuthorize sudah menangani error response, jadi kita hanya perlu user
            // Jika Anda ingin melewati roles di sini, Anda bisa panggil authenticate(request) jika ada
            // atau modifikasi authenticateAndAuthorize untuk menerima array kosong.
            const { user } = await authenticateAndAuthorize(request, ['customer', 'umkm_owner', 'admin']); // Sesuaikan roles yang relevan
            if (user) {
                return {
                    userId: user.userId,
                    method: 'jwt' as const,
                    userRole: user.role as 'customer' | 'umkm_owner' | 'admin' // Casting role untuk tipe aman
                };
            }
        }

        // 2. Coba NextAuth session (dari cookie)
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            // Temukan user di database berdasarkan email dari NextAuth session
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
        console.error("Authentication error in orders API:", error);
        return null;
    }
}
// =========================================================================

export async function POST(request: NextRequest) {
    // Gunakan helper baru untuk mendapatkan user ID dan metode auth
    const authResult = await getUserAndAuthMethodFromRequest(request);

    if (!authResult) {
        // Jika tidak ada user terautentikasi, kembalikan unauthorized
        return errorResponse("Unauthorized", 401, "Authentication required.");
    }

    const { userId, userRole } = authResult;

    // Tambahkan otorisasi berdasarkan role jika diperlukan untuk POST
    // Misalnya, hanya customer dan umkm_owner yang bisa membuat order
    if (userRole !== "customer" && userRole !== "umkm_owner") {
        return errorResponse("Forbidden", 403, "Only customers and UMKM owners can create orders.");
    }


    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress) {
        return errorResponse("Shipping address is required", 400);
    }

    try {
        const shoppingCart = await prisma.shoppingCart.findUnique({
            where: { customerId: userId }, // Gunakan userId dari authResult
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
                    customerId: userId, // Gunakan userId dari authResult
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
    // Gunakan helper baru untuk mendapatkan user ID dan metode auth
    const authResult = await getUserAndAuthMethodFromRequest(request);

    if (!authResult) {
        // Jika tidak ada user terautentikasi, kembalikan unauthorized
        return errorResponse("Unauthorized", 401, "Authentication required.");
    }

    const { userId, userRole } = authResult;

    // Tambahkan otorisasi berdasarkan role jika diperlukan untuk GET
    // Misalnya, hanya customer dan umkm_owner yang bisa melihat order mereka
    if (userRole !== "customer" && userRole !== "umkm_owner" && userRole !== "admin") {
         return errorResponse("Forbidden", 403, "You do not have permission to view orders.");
    }

    try {
        const orders = await prisma.order.findMany({
            where: { customerId: userId }, // Gunakan userId dari authResult
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
                                reviews: {
                                    where: {
                                        customerId: userId, // Gunakan userId dari authResult
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