// app/api/admin/umkm-owners/[id]/verify/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response; // Hanya admin yang bisa mengakses

  const { id: umkmId } = params;
  const { isVerified } = await request.json();

  if (typeof isVerified !== 'boolean') {
    return errorResponse('isVerified must be a boolean', 400);
  }

  try {
    const updatedUMKM = await prisma.uMKMOwner.update({
      where: { id: umkmId },
      data: { isVerified },
      select: {
        id: true,
        umkmName: true,
        isVerified: true,
        user: {
          select: { username: true, email: true },
        },
      },
    });

    return successResponse({ message: 'UMKM verification status updated successfully', umkm: updatedUMKM });

  } catch (error: any) {
    console.error(`Error updating UMKM ${umkmId} verification status:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return errorResponse('UMKM not found', 404);
    }
    return errorResponse('Failed to update UMKM verification status', 500, error.message);
  }
}