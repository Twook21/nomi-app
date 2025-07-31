import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// Helper function to get user ID and auth method (assuming it's reusable)
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
        console.error("Authentication error in UMKM profile API:", error);
        return null;
    }
}

// [GET] - Mengambil profil UMKM yang sedang login
export async function GET(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa melihat profil ini
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk melihat profil UMKM.");
  }

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      // Select semua field yang relevan untuk form pengaturan
      select: {
        id: true,
        umkmName: true,
        umkmDescription: true,
        umkmAddress: true,
        umkmPhoneNumber: true,
        umkmEmail: true,
        bankName: true,
        bankAccountNumber: true,
        isVerified: true, // Tambahkan isVerified
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }
    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    // Transformasi untuk memastikan nilai null menjadi string kosong atau null sesuai kebutuhan frontend
    const transformedUmkmOwner = {
        ...umkmOwner,
        umkmDescription: umkmOwner.umkmDescription || null,
        bankName: umkmOwner.bankName || null,
        bankAccountNumber: umkmOwner.bankAccountNumber || null,
    };

    return successResponse(transformedUmkmOwner);
  } catch (error: any) {
    console.error('Error fetching UMKM profile:', error);
    return errorResponse('Failed to fetch UMKM profile', 500, error.message);
  }
}

// [PUT] - Memperbarui profil UMKM yang sedang login
export async function PUT(request: NextRequest) {
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya UMKM owner atau admin yang bisa memperbarui profil ini
  if (userRole !== "umkm_owner" && userRole !== "admin") {
    return errorResponse("Forbidden", 403, "Anda tidak memiliki izin untuk memperbarui profil UMKM.");
  }

  try {
    const data = await request.json();

    // Validasi data yang masuk
    if (!data.umkmName || !data.umkmEmail || !data.umkmPhoneNumber || !data.umkmAddress) {
        return errorResponse('Data UMKM yang wajib diisi tidak lengkap', 400);
    }

    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: userId },
      select: { id: true, isVerified: true }, // Ambil isVerified
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }
    // Jika UMKM belum terverifikasi, larang akses
    if (!umkmOwner.isVerified) {
        return errorResponse("UMKM profile not verified.", 403, "Profil UMKM Anda belum diverifikasi. Mohon tunggu persetujuan admin.");
    }

    const updatedUmkm = await prisma.uMKMOwner.update({
      where: { userId: userId },
      data: {
        umkmName: data.umkmName,
        umkmDescription: data.umkmDescription || null, // Pastikan bisa null
        umkmAddress: data.umkmAddress,
        umkmPhoneNumber: data.umkmPhoneNumber,
        umkmEmail: data.umkmEmail,
        bankName: data.bankName || null, // Pastikan bisa null
        bankAccountNumber: data.bankAccountNumber || null, // Pastikan bisa null
      },
    });

    // Karena ini adalah update, kita bisa mengembalikan profil UMKM yang diperbarui
    return successResponse({ message: 'Profil UMKM berhasil diperbarui', umkm: updatedUmkm });
  } catch (error: any) {
    console.error('Error updating UMKM profile:', error);
    return errorResponse('Gagal memperbarui profil UMKM', 500, error.message);
  }
}