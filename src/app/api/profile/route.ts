// app/api/profile/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import bcrypt from 'bcryptjs'; // <-- Tambahkan baris ini jika belum ada

export async function GET(request: NextRequest) {
  // Autentikasi dan otorisasi: hanya perlu terautentikasi (tidak peduli role)
  const { user, response } = await authenticateAndAuthorize(request);
  if (response) return response; // Jika ada error dari autentikasi/otorisasi

  try {
    // Ambil detail user dari database (opsional, bisa juga pakai data dari token langsung)
    const userDetails = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Sertakan relasi jika diperlukan, misal untuk UMKM owner
        umkmOwner: user!.role === 'umkm_owner' ? {
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

    return successResponse(userDetails);

  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return errorResponse('Failed to fetch user profile', 500, error.message);
  }
}

export async function PUT(request: NextRequest) {
  // Autentikasi dan otorisasi: hanya perlu terautentikasi
  const { user, response } = await authenticateAndAuthorize(request);
  if (response) return response;

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
      where: { id: user!.userId },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
        updatedAt: true,
      },
    });

    return successResponse({ message: 'User profile updated successfully', user: updatedUser });

  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return errorResponse('Failed to update user profile', 500, error.message);
  }
}