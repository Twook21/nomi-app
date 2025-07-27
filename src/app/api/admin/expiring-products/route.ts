import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { addDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const expiringProducts = await prisma.product.findMany({
      where: {
        isAvailable: true,
        expirationDate: {
          gte: new Date(),
          lte: addDays(new Date(), 7), // Ambil produk yang akan kedaluwarsa dalam 7 hari
        },
      },
      take: 5,
      orderBy: {
        expirationDate: 'asc',
      },
      select: {
        id: true,
        productName: true,
        expirationDate: true,
        umkmOwner: {
          select: {
            umkmName: true,
          },
        },
      },
    });

    return successResponse(expiringProducts);
  } catch (error: any) {
    return errorResponse('Failed to fetch expiring products', 500, error.message);
  }
}