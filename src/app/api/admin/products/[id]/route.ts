import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        const { isAvailable } = await request.json();
        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: { isAvailable },
        });
        return successResponse(updatedProduct);
    } catch (error: any) {
        return errorResponse('Failed to update product status', 500, error.message);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        await prisma.product.delete({ where: { id: params.id } });
        return successResponse({ message: 'Product deleted successfully' });
    } catch (error: any) {
        return errorResponse('Failed to delete product', 500, error.message);
    }
}