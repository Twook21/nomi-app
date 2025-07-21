// app/api/orders/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  const { shippingAddress, paymentMethod } = await request.json();

  if (!shippingAddress) {
    return errorResponse('Shipping address is required', 400);
  }

  try {
    // Ambil item dari keranjang belanja user
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { customerId: user!.userId },
      include: {
        cartItems: {
          include: {
            product: true, // Sertakan detail produk
          },
        },
      },
    });

    if (!shoppingCart || shoppingCart.cartItems.length === 0) {
      return errorResponse('Shopping cart is empty', 400);
    }

    let totalAmount = 0;
    const orderItemsData: any[] = [];
    const productsToUpdate: { id: string; stock: number }[] = [];
    const umkmIdsInOrder = new Set<string>();

    // Validasi stok dan hitung total jumlah
    for (const item of shoppingCart.cartItems) {
      const product = item.product;

      if (!product || !product.isAvailable || product.expirationDate < new Date()) {
        return errorResponse(`Product "${product?.productName || item.productId}" is not available or has expired.`, 400);
      }
      if (product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for "${product.productName}". Only ${product.stock} available.`, 400);
      }

      totalAmount += item.quantity * product.discountedPrice.toNumber();
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        pricePerItem: product.discountedPrice,
      });
      productsToUpdate.push({
        id: product.id,
        stock: product.stock - item.quantity,
      });
      umkmIdsInOrder.add(product.umkmId);
    }

    if (umkmIdsInOrder.size > 1) {
      // Jika pesanan mencakup produk dari lebih dari satu UMKM, ini perlu ditangani
      // Misalnya, membuat beberapa pesanan terpisah atau melarangnya.
      // Untuk kesederhanaan, kita asumsikan satu UMKM per pesanan atau kita ambil UMKM pertama.
      // Anda mungkin perlu memecah ini menjadi beberapa pesanan jika ada banyak UMKM
      return errorResponse('Orders can only contain products from one UMKM at a time.', 400);
    }
    const umkmId = Array.from(umkmIdsInOrder)[0];


    // Mulai transaksi database
    const order = await prisma.$transaction(async (tx) => {
      // Buat pesanan utama
      const newOrder = await tx.order.create({
        data: {
          customerId: user!.userId,
          umkmId: umkmId, // Ambil UMKM ID dari salah satu produk
          totalAmount: totalAmount,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod || 'Cash on Pickup', // Default
          orderItems: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
      });

      // Update stok produk
      for (const productUpdate of productsToUpdate) {
        await tx.product.update({
          where: { id: productUpdate.id },
          data: { stock: productUpdate.stock },
        });
      }

      // Hapus item dari keranjang belanja setelah pesanan dibuat
      await tx.cartItem.deleteMany({
        where: { cartId: shoppingCart.id },
      });

      return newOrder;
    });

    return successResponse({ message: 'Order created successfully', orderId: order.id }, 201);

  } catch (error: any) {
    console.error('Error creating order:', error);
    return errorResponse('Failed to create order', 500, error.message);
  }
}

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  try {
    const orders = await prisma.order.findMany({
      where: { customerId: user!.userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                productName: true,
                imageUrl: true,
              },
            },
          },
        },
        umkmOwner: {
          select: {
            umkmName: true,
            umkmAddress: true,
            umkmPhoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(orders);

  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    return errorResponse('Failed to fetch customer orders', 500, error.message);
  }
}