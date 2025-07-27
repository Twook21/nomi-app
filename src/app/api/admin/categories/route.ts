import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    try {
        const where: any = {};
        if (search) {
            where.categoryName = { contains: search, mode: 'insensitive' };
        }

        const categories = await prisma.foodCategory.findMany({
            where,
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { categoryName: 'asc' }
        });
        return successResponse(categories);
    } catch (error: any) {
        return errorResponse('Gagal mengambil kategori', 500, error.message);
    }
}

export async function POST(request: NextRequest) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        const { categoryName } = await request.json();
        if (!categoryName) {
            return errorResponse('Nama kategori harus diisi', 400);
        }
        const newCategory = await prisma.foodCategory.create({
            data: { categoryName }
        });
        return successResponse(newCategory, 201);
    } catch (error: any) {
        return errorResponse('Gagal membuat kategori', 500, error.message);
    }
}

