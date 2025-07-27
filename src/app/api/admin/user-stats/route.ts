import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const totalUsers = await prisma.user.count();
    const customerCount = await prisma.user.count({ where: { role: 'customer' } });
    const umkmCount = await prisma.user.count({ where: { role: 'umkm_owner' } });

    return successResponse({
      totalUsers,
      customerCount,
      umkmCount,
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch user stats', 500, error.message);
  }
}