import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, ProductStatus } from '@prisma/client';

function serializeProduct(product: any) {
  return {
    ...product,
    id: product.id.toString(),
    partnerId: product.partnerId.toString(),
    categoryId: product.categoryId.toString(),
    originalPrice: product.originalPrice.toString(),
    discountedPrice: product.discountedPrice.toString(),
    ...(product.partner && { 
        partner: {
            ...product.partner,
            id: product.partner.id.toString(),
            userId: product.partner.userId.toString(),
        }
    }),
    ...(product.category && {
        category: {
            ...product.category,
            id: product.category.id.toString(),
        }
    })
  };
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        partner: {
          select: { storeName: true, id: true, userId: true }
        },
        category: {
          select: { name: true, id: true } 
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const serializableProducts = products.map(serializeProduct);
    return NextResponse.json(serializableProducts);

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, description, imageUrl, partnerId, categoryId, 
      originalPrice, discountedPrice, quantity, expirationDate, status 
    } = body;

    if (!name || !partnerId || !categoryId || !originalPrice || !discountedPrice || !quantity || !expirationDate) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        partnerId: BigInt(partnerId),
        categoryId: BigInt(categoryId),
        originalPrice: new Prisma.Decimal(originalPrice),
        discountedPrice: new Prisma.Decimal(discountedPrice),
        quantity: parseInt(quantity, 10),
        expirationDate: new Date(expirationDate),
        status: status as ProductStatus || ProductStatus.AVAILABLE,
      },
      include: {
        partner: true,
        category: true
      }
    });

    return NextResponse.json(serializeProduct(newProduct), { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}