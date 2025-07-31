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
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['customer']); // Hanya customer yang bisa register UMKM
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

            if (dbUser && dbUser.role === 'customer') { // Hanya customer yang bisa register UMKM
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in UMKM register API:", error);
        return null;
    }
}
// =========================================================================

export async function POST(request: NextRequest) {
  // Gunakan helper baru untuk mendapatkan user ID dan metode auth
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  // Otorisasi: Hanya customer yang boleh mendaftar sebagai UMKM.
  // Jika sudah umkm_owner, harusnya tidak bisa mendaftar lagi, atau harus admin.
  if (userRole !== 'customer') {
    return errorResponse('Forbidden', 403, 'Hanya pengguna dengan peran "customer" yang dapat mendaftar sebagai UMKM.');
  }

  try {
    const data = await request.json();

    if (!data.umkmName || !data.umkmEmail || !data.umkmPhoneNumber || !data.umkmAddress) {
      return errorResponse('Data UMKM yang wajib diisi tidak lengkap', 400);
    }

    // Cek apakah user ini sudah punya profil UMKM
    const existingUmkm = await prisma.uMKMOwner.findUnique({
        where: { userId: userId }, // Gunakan userId dari authResult
    });

    if (existingUmkm) {
        return errorResponse('Anda sudah memiliki profil UMKM.', 409);
    }

    const newUmkmProfile = await prisma.uMKMOwner.create({
        data: {
          userId: userId, // Gunakan userId dari authResult
          umkmName: data.umkmName,
          umkmDescription: data.umkmDescription || null, // Pastikan deskripsi bisa null jika opsional
          umkmAddress: data.umkmAddress,
          umkmPhoneNumber: data.umkmPhoneNumber,
          umkmEmail: data.umkmEmail,
          bankName: data.bankName || null, // Pastikan bisa null
          bankAccountNumber: data.bankAccountNumber || null, // Pastikan bisa null
          isVerified: false,
        },
      });

    return successResponse({ message: 'Pendaftaran UMKM berhasil! Mohon tunggu persetujuan dari admin.', umkm: newUmkmProfile }, 201);

  } catch (error: any) {
    // P2002 (unique constraint failed) tidak selalu berarti sudah ada UMKM, bisa juga email/username
    // Untuk UMKM, constraint uniknya ada di userId, jadi ini lebih tepat.
    if (error.code === 'P2002') {
      return errorResponse('Terjadi konflik data. Mungkin Anda sudah terdaftar sebagai mitra UMKM.', 409);
    }
    console.error('Error creating UMKM profile:', error);
    return errorResponse('Gagal mendaftar sebagai UMKM', 500, error.message);
  }
}