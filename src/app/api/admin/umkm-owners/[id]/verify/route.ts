// app/api/admin/umkm-owners/[id]/verify/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// Helper untuk mendapatkan user ID dari request (support dual auth)
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const { user } = await (await import("@/lib/auth")).authenticateAndAuthorize(request, ['admin']);
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

            if (dbUser && dbUser.role === 'admin') {
                return {
                    userId: dbUser.id,
                    method: 'nextauth' as const,
                    userRole: dbUser.role as 'customer' | 'umkm_owner' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Authentication error in verify UMKM API:", error);
        return null;
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Support dual authentication
  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Admin authentication required.");
  }

  const { userRole } = authResult;

  // Only admin can verify
  if (userRole !== 'admin') {
    return errorResponse('Forbidden', 403, 'Only admin can verify UMKM partners.');
  }

  const { id: umkmId } = params;
  const { isVerified } = await request.json();

  if (typeof isVerified !== 'boolean') {
    return errorResponse('isVerified must be a boolean', 400);
  }

  try {
    // 1. Update UMKM verification status
    const updatedUMKM = await prisma.uMKMOwner.update({
      where: { id: umkmId },
      data: { isVerified },
      select: {
        id: true,
        umkmName: true,
        isVerified: true,
        userId: true, // TAMBAHKAN: Ambil userId untuk update user role
        user: {
          select: { 
            id: true,
            username: true, 
            email: true,
            role: true 
          },
        },
      },
    });

    // 2. PERBAIKAN: Update user role jika diverifikasi
    if (isVerified) {
      await prisma.user.update({
        where: { id: updatedUMKM.userId },
        data: { 
          role: 'umkm_owner' // Update role dari customer ke umkm_owner
        }
      });
    } else {
      // Jika ditolak, kembalikan role ke customer dan hapus profil UMKM
      await prisma.user.update({
        where: { id: updatedUMKM.userId },
        data: { 
          role: 'customer' 
        }
      });
      
      // Hapus profil UMKM jika ditolak
      await prisma.uMKMOwner.delete({
        where: { id: umkmId }
      });
    }

    // 3. TAMBAHKAN: Trigger session refresh untuk user yang diverifikasi
    // Ini akan memaksa NextAuth session ter-refresh saat user berikutnya mengakses aplikasi
    
    const message = isVerified 
      ? `UMKM "${updatedUMKM.umkmName}" berhasil diverifikasi dan user role diupdate ke umkm_owner`
      : `UMKM "${updatedUMKM.umkmName}" ditolak dan profil UMKM dihapus`;

    return successResponse({ 
      message, 
      umkm: updatedUMKM,
      // TAMBAHKAN: Info untuk frontend
      userUpdate: {
        userId: updatedUMKM.userId,
        newRole: isVerified ? 'umkm_owner' : 'customer',
        umkmProfileStatus: isVerified ? 'verified' : null
      }
    });

  } catch (error: any) {
    console.error(`Error updating UMKM ${umkmId} verification status:`, error);
    if (error.code === 'P2025') {
      return errorResponse('UMKM not found', 404);
    }
    return errorResponse('Failed to update UMKM verification status', 500, error.message);
  }
}