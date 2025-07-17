import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Helper untuk serialisasi, bisa diletakkan di file terpisah
function serialize(data: any): any {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() :
    value instanceof Prisma.Decimal ? value.toNumber() :
    value
  ));
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            price: true,
          }
        }
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return NextResponse.json(serialize(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}