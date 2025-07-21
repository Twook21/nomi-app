import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  const { id: orderId } = params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        customerId: user!.userId, // Pastikan hanya pemilik order yang bisa melihat
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                imageUrl: true,
                discountedPrice: true,
              },
            },
          },
        },
        umkmOwner: {
          select: {
            id: true,
            umkmName: true,
            umkmAddress: true,
            umkmPhoneNumber: true,
            umkmEmail: true,
          },
        },
        customer: {
          select: {
            username: true,
            email: true,
          }
        }
      },
    });

    if (!order) {
      return errorResponse('Order not found or you do not have permission to view it', 404);
    }

    // Anda bisa menghasilkan data QR code di sini jika diperlukan
    // Contoh: const qrCodeData = `nomi_order:${order.id}`;

    return successResponse(order);

  } catch (error: any) {
    console.error(`Error fetching order ${orderId}:`, error);
    return errorResponse('Failed to fetch order details', 500, error.message);
  }
}