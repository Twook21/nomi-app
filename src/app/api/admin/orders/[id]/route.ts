import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, Prisma } from '@prisma/client';

// Helper untuk serialisasi
function serialize(data: any): any {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() :
    value instanceof Prisma.Decimal ? value.toNumber() :
    value
  ));
}

// GET (Fetch single order with full details)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = BigInt(params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(serialize(order));
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// PUT (Update order status)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = BigInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ message: "Status tidak valid" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json(serialize(updatedOrder));
  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    
    // Hapus OrderItems terkait terlebih dahulu untuk menghindari error foreign key
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Baru hapus Order
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pesanan berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting order ${params.id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ message: "Pesanan tidak ditemukan untuk dihapus" }, { status: 404 });
      }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}