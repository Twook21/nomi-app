import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, createdAt: true },
    });

    const recentUmkms = await prisma.uMKMOwner.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, umkmName: true, createdAt: true },
    });

    return successResponse({ recentUsers, recentUmkms });
  } catch (error: any) {
    return errorResponse('Failed to fetch recent activity', 500, error.message);
  }
}
