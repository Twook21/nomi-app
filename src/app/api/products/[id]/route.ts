// File: src/app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id; // Mengakses id dari params

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        umkmOwner: {
          select: {
            id: true,
            umkmName: true,
            umkmDescription: true,
            umkmAddress: true,
            umkmPhoneNumber: true,
            umkmEmail: true,
            isVerified: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                username: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || !product.isAvailable || product.expirationDate < new Date()) {
      return NextResponse.json(
        { message: 'Product not found or is no longer available' },
        { status: 404 }
      );
    }

    // Menggunakan NextResponse.json standar
    return NextResponse.json({ data: product }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch product details', error: error.message },
      { status: 500 }
    );
  }
}