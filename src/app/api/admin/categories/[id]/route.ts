import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        const { categoryName } = await request.json();
        if (!categoryName) {
            return errorResponse('Nama kategori harus diisi', 400);
        }
        const updatedCategory = await prisma.foodCategory.update({
            where: { id: params.id },
            data: { categoryName },
        });
        return successResponse(updatedCategory);
    } catch (error: any) {
        return errorResponse('Gagal memperbarui kategori', 500, error.message);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        await prisma.foodCategory.delete({
            where: { id: params.id },
        });
        return successResponse({ message: 'Kategori berhasil dihapus' });
    } catch (error: any) {
        return errorResponse('Gagal menghapus kategori', 500, error.message);
    }
}