import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const totalUmkm = await prisma.uMKMOwner.count();
    const verifiedUmkm = await prisma.uMKMOwner.count({ where: { isVerified: true } });
    const pendingUmkm = await prisma.uMKMOwner.count({ where: { isVerified: false } });

    return successResponse({
      totalUmkm,
      verifiedUmkm,
      pendingUmkm,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch UMKM stats', 500, error.message);
  }
}