import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        umkmOwner: {
          select: { id: true, umkmName: true },
        },
        reviews: {
          include: {
            customer: {
              // PERBAIKAN: Pilih semua kolom customer yang dibutuhkan
              select: {
                username: true,
                name: true,
                image: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    const otherProductsFromUmkm = await prisma.product.findMany({
      where: {
        umkmId: product.umkmId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        umkmOwner: { select: { umkmName: true } },
      }
    });

    return successResponse({
      product,
      otherProducts: otherProductsFromUmkm,
    });

  } catch (error: any) {
    return errorResponse('Failed to fetch product details', 500, error.message);
  }
}
