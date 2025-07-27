import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.foodCategory.findMany({
      orderBy: {
        categoryName: 'asc',
      },
    });
    return successResponse(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500, error.message);
  }
}