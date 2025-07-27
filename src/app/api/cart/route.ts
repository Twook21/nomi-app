import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer', 'umkm_owner']);
  if (response) return response;
  
  const { searchParams } = new URL(request.url);
  const countOnly = searchParams.get('countOnly') === 'true';

  try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
      include: {
        _count: {
            select: { cartItems: true }
        },
        // Hanya include item jika tidak hanya mengambil jumlah
        ...(!countOnly && {
            cartItems: {
              include: {
                product: {
                  select: { id: true, productName: true, discountedPrice: true, stock: true, imageUrl: true },
                },
              },
            },
        })
      },
    });

    if (countOnly) {
        return successResponse({ itemCount: shoppingCart?._count.cartItems ?? 0 });
    }

    if (!shoppingCart) {
      const newCart = await prisma.shoppingCart.create({
        data: { customerId: user!.userId },
        include: { cartItems: true },
      });
      return successResponse(newCart);
    }

    return successResponse(shoppingCart);

  } catch (error: any) {
    return errorResponse('Failed to fetch shopping cart', 500, error.message);
  }
}
