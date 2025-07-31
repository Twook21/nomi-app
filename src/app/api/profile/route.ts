// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Import NextResponse
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/lib/auth-config"; // Import authOptions

// Helper function to get user ID and method from different auth methods
// Pindahkan ini ke tempat yang bisa di-share atau gunakan yang sudah ada jika tersedia
// Jika ini adalah fungsi baru, pertimbangkan untuk memindahkannya ke lib/auth atau lib/helpers
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
    try {
        // 1. Coba JWT authentication (dari header Authorization)
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            // authenticateAndAuthorize sudah menangani error response, jadi kita hanya perlu user
            const { user } = await authenticateAndAuthorize(request); // Tanpa roles karena GET/PUT profile bisa semua user
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
            // Ini penting untuk mendapatkan ID user dan role yang sesuai dengan database
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    role: true, // Pastikan role juga diambil
                    email: true, // Ambil juga email untuk debugging/konfirmasi
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
        console.error("Authentication error in profile API:", error);
        return null; // Tangani error secara graceful
    }
}

export async function GET(request: NextRequest) {
    // Gunakan helper baru untuk mendapatkan ID user dan metode auth
    const authResult = await getUserAndAuthMethodFromRequest(request);

    if (!authResult) {
        return errorResponse("Unauthorized", 401, "Authentication required.");
    }

    const { userId, userRole } = authResult; // Dapatkan userId dan userRole

    try {
        // Ambil detail user dari database
        const userDetails = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true, // Tambahkan name jika ada di model User Anda
                image: true, // Tambahkan image jika ada di model User Anda
                phoneNumber: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Sertakan relasi jika diperlukan, misal untuk UMKM owner
                umkmOwner: userRole === 'umkm_owner' ? { // Gunakan userRole dari authResult
                    select: {
                        id: true,
                        umkmName: true,
                        isVerified: true,
                    }
                } : false, // Jangan sertakan jika bukan UMKM owner
            },
        });

        if (!userDetails) {
            return errorResponse('User not found', 404);
        }

        // Pastikan properti name dan image selalu ada meskipun null
        const responseData = {
            ...userDetails,
            name: userDetails.name ?? null, // Ensure name is null if undefined
            image: userDetails.image ?? null, // Ensure image is null if undefined
        };

        return successResponse(responseData); // Mengembalikan detail user yang sudah diambil
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return errorResponse('Failed to fetch user profile', 500, error.message);
    }
}

export async function PUT(request: NextRequest) {
    // Gunakan helper baru untuk mendapatkan ID user dan metode auth
    const authResult = await getUserAndAuthMethodFromRequest(request);

    if (!authResult) {
        return errorResponse("Unauthorized", 401, "Authentication required.");
    }

    const { userId } = authResult; // Dapatkan userId

    try {
        const { phoneNumber, address, password } = await request.json();
        let dataToUpdate: any = {};

        if (phoneNumber !== undefined) dataToUpdate.phoneNumber = phoneNumber;
        if (address !== undefined) dataToUpdate.address = address;
        if (password) {
            dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return errorResponse('No fields to update provided', 400);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId }, // Gunakan userId dari authResult
            data: dataToUpdate,
            select: {
                id: true,
                username: true,
                email: true,
                name: true, // Tambahkan name
                image: true, // Tambahkan image
                phoneNumber: true,
                address: true,
                role: true,
                updatedAt: true,
            },
        });

        // Pastikan properti name dan image selalu ada meskipun null di respons
        const responseData = {
            ...updatedUser,
            name: updatedUser.name ?? null,
            image: updatedUser.image ?? null,
        };

        return successResponse({ message: 'User profile updated successfully', user: responseData });
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        return errorResponse('Failed to update user profile', 500, error.message);
    }
}