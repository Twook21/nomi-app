// app/api/cart/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                discountedPrice: true,
                stock: true,
                imageUrl: true,
                umkmOwner: {
                  select: { umkmName: true },
                },
              },
            },
          },
        },
      },
    });

    if (!shoppingCart) {
      // Buat keranjang jika belum ada
      const newCart = await prisma.shoppingCart.create({
        data: { customerId: user!.userId },
        include: { cartItems: { include: { product: true } } },
      });
      return successResponse(newCart);
    }

    return successResponse(shoppingCart);

  } catch (error: any) {
    console.error('Error fetching shopping cart:', error);
    return errorResponse('Failed to fetch shopping cart', 500, error.message);
  }
}