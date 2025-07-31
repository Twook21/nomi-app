// src/app/api/umkm-owners/me/products/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// getUserAndAuthMethodFromRequest (assuming it's reusable)
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
        console.error("Authentication error in UMKM product detail/edit API:", error);
        return null;
    }
}

async function verifyProductOwnerAndStatus(userId: string, productId: string) {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
        where: { userId },
        select: { id: true, isVerified: true },
    });

    if (!umkmOwner) {
        return { error: errorResponse('Profil UMKM tidak ditemukan untuk user ini', 404) };
    }
    if (!umkmOwner.isVerified) {
        return { error: errorResponse('Profil UMKM belum diverifikasi', 403, 'Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.') };
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { umkmId: true },
    });

    if (!product) {
        return { error: errorResponse('Produk tidak ditemukan', 404) };
    }

    if (product.umkmId !== umkmOwner.id) {
        return { error: errorResponse('Anda tidak memiliki izin untuk mengakses produk ini', 403) };
    }

    return { umkmOwner, product };
}

export async function GET(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } } // Gunakan nama berbeda untuk params awal
) {
  // Solusi: Await params
  const params = await rawParams;
  const { id: productId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat detail produk UMKM.");
  }

  const verification = await verifyProductOwnerAndStatus(userId, productId); // Gunakan productId yang sudah di-await
  if (verification.error) return verification.error;

  try {
    const productData = await prisma.product.findUnique({
      where: { id: productId }, // Gunakan productId yang sudah di-await
      include: {
        reviews: {
          select: { rating: true },
        },
        category: {
          select: { id: true, categoryName: true },
        },
      },
    });

    if (!productData) {
      return errorResponse("Product not found", 404);
    }

    const totalRating = productData.reviews.reduce((acc, review) => acc + review.rating, 0);
    const reviewCount = productData.reviews.length;
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    const { reviews, ...productInfo } = productData;

    const transformedProduct = {
        ...productInfo,
        description: productInfo.description || '',
        imageUrl: productInfo.imageUrl || '',
        averageRating: parseFloat(averageRating.toFixed(1)),
    };

    return successResponse(transformedProduct);

  } catch (e: any) {
    console.error(`Error fetching UMKM product ${productId} details:`, e); // Gunakan productId yang sudah di-await
    return errorResponse('Gagal mengambil detail produk', 500, e.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } } // Gunakan nama berbeda untuk params awal
) {
  // Solusi: Await params
  const params = await rawParams;
  const { id: productId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk memperbarui produk ini.");
  }

  const verification = await verifyProductOwnerAndStatus(userId, productId); // Gunakan productId yang sudah di-await
  if (verification.error) return verification.error;

  try {
    const data = await request.json();

    if (!data.productName || !data.originalPrice || !data.discountedPrice || data.stock === undefined || !data.expirationDate) {
        return errorResponse('Missing required product fields', 400);
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId }, // Gunakan productId yang sudah di-await
        data: {
            productName: data.productName,
            description: data.description || null,
            originalPrice: parseFloat(data.originalPrice),
            discountedPrice: parseFloat(data.discountedPrice),
            stock: parseInt(data.stock),
            expirationDate: new Date(data.expirationDate),
            imageUrl: data.imageUrl || null,
            categoryId: data.categoryId || null,
        },
    });
    return successResponse({ message: 'Produk berhasil diperbarui', product: updatedProduct });
  } catch (e: any) {
    console.error(`Error updating UMKM product ${productId}:`, e); // Gunakan productId yang sudah di-await
    return errorResponse('Gagal memperbarui produk', 500, e.message);
  }
}