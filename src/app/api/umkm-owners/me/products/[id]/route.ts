import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  const { id: productId } = params;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    const {
      productName,
      description,
      originalPrice,
      discountedPrice,
      stock,
      expirationDate,
      imageUrl,
      categoryId,
      isAvailable,
    } = await request.json();

    const dataToUpdate: any = {};
    if (productName !== undefined) dataToUpdate.productName = productName;
    if (description !== undefined) dataToUpdate.description = description;
    if (originalPrice !== undefined) dataToUpdate.originalPrice = parseFloat(originalPrice);
    if (discountedPrice !== undefined) dataToUpdate.discountedPrice = parseFloat(discountedPrice);
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);
    if (expirationDate !== undefined) dataToUpdate.expirationDate = new Date(expirationDate);
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (isAvailable !== undefined) dataToUpdate.isAvailable = isAvailable;

    if (Object.keys(dataToUpdate).length === 0) {
      return errorResponse('No fields to update provided', 400);
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        umkmId: umkmOwner.id, // Pastikan produk ini milik UMKM yang login
      },
      data: dataToUpdate,
    });

    return successResponse({ message: 'Product updated successfully', product: updatedProduct });

  } catch (error: any) {
    console.error(`Error updating product ${productId}:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return errorResponse('Product not found or you do not have permission to update it', 404);
    }
    return errorResponse('Failed to update product', 500, error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  const { id: productId } = params;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      select: { id: true },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    await prisma.product.delete({
      where: {
        id: productId,
        umkmId: umkmOwner.id, // Pastikan produk ini milik UMKM yang login
      },
    });

    return successResponse({ message: 'Product deleted successfully' });

  } catch (error: any) {
    console.error(`Error deleting product ${productId}:`, error);
    if (error.code === 'P2025') {
      return errorResponse('Product not found or you do not have permission to delete it', 404);
    }
    return errorResponse('Failed to delete product', 500, error.message);
  }
}
