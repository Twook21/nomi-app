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
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['umkm_owner', 'admin']); // Hanya UMKM owner atau admin
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

            if (dbUser && (dbUser.role === 'umkm_owner' || dbUser.role === 'admin')) { // Hanya UMKM owner atau admin
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in UMKM products API:", error);
        return null;
    }
}
// =========================================================================

// [GET] - Mengambil daftar produk milik UMKM yang sedang login
export async function GET(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa melihat produk ini
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat produk UMKM.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      select: { id: true, isVerified: true }, // Tambahkan isVerified
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const searchParams = request.nextUrl.searchParams;
    const isAvailable = searchParams.get('isAvailable');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      umkmId: umkmOwner.id,
    };

    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }

    const productsData = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { categoryName: true },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalProducts = await prisma.product.count({ where });

    const products = productsData.map(p => {
      const totalRating = p.reviews.reduce((acc, review) => acc + review.rating, 0);
      const reviewCount = p.reviews.length;
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      const { reviews, ...productData } = p;

      return {
        ...productData,
        description: productData.description || '', // Tambahkan fallback
        imageUrl: productData.imageUrl || 'https://placehold.co/100x100', // Tambahkan fallback
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviewCount,
      };
    });

    return successResponse({
      products,
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
    });

  } catch (error: any) {
    console.error('Error fetching UMKM products:', error);
    return errorResponse('Failed to fetch UMKM products', 500, error.message);
  }
}

// [POST] - Menambahkan produk baru
export async function POST(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa menambah produk
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk menambah produk.");
  }

  try {
    const {
      productName,
      description,
      originalPrice,
      discountedPrice,
      stock,
      expirationDate,
      imageUrl,
      categoryId,
    } = await request.json();

    if (!productName || !originalPrice || !discountedPrice || stock === undefined || !expirationDate) {
      return errorResponse('Missing required product fields', 400);
    }

    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId }, // Gunakan userId dari authResult
      select: { id: true, isVerified: true }, // Tambahkan isVerified
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const newProduct = await prisma.product.create({
      data: {
        umkmId: umkmOwner.id,
        productName,
        description: description || null, // Pastikan deskripsi bisa null
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        stock: parseInt(stock),
        expirationDate: new Date(expirationDate),
        imageUrl: imageUrl || null, // Pastikan imageUrl bisa null
        categoryId,
      },
    });

    return successResponse({ message: 'Product added successfully', product: newProduct }, 201);

  } catch (error: any) {
    console.error('Error adding product:', error);
    return errorResponse('Failed to add product', 500, error.message);
  }
}