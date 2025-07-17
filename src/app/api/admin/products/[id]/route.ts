import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, ProductStatus } from '@prisma/client';

// Fungsi serialisasi yang sama bisa ditaruh di file terpisah (e.g., lib/serializer.ts)
function serializeProduct(product: any) {
  return {
    ...product,
    id: product.id.toString(),
    partnerId: product.partnerId.toString(),
    categoryId: product.categoryId.toString(),
    originalPrice: product.originalPrice.toString(),
    discountedPrice: product.discountedPrice.toString(),
    ...(product.partner && { partner: { ...product.partner, id: product.partner.id.toString(), userId: product.partner.userId.toString() } }),
    ...(product.category && { category: { ...product.category, id: product.category.id.toString() } })
  };
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = BigInt(params.id);
    const body = await request.json();

    const dataToUpdate: Prisma.ProductUpdateInput = {};
    const { 
      name, description, imageUrl, partnerId, categoryId, 
      originalPrice, discountedPrice, quantity, expirationDate, status 
    } = body;

    if (name) dataToUpdate.name = name;
    if (description) dataToUpdate.description = description;
    if (imageUrl) dataToUpdate.imageUrl = imageUrl;
    if (partnerId) dataToUpdate.partner = { connect: { id: BigInt(partnerId) } };
    if (categoryId) dataToUpdate.category = { connect: { id: BigInt(categoryId) } };
    if (originalPrice) dataToUpdate.originalPrice = new Prisma.Decimal(originalPrice);
    if (discountedPrice) dataToUpdate.discountedPrice = new Prisma.Decimal(discountedPrice);
    if (quantity !== undefined) dataToUpdate.quantity = parseInt(quantity, 10);
    if (expirationDate) dataToUpdate.expirationDate = new Date(expirationDate);
    if (status) dataToUpdate.status = status as ProductStatus;
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: dataToUpdate,
      include: { partner: true, category: true },
    });
    
    return NextResponse.json(serializeProduct(updatedProduct));

  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: "Produk tidak ditemukan untuk dihapus" }, { status: 404 });
      }
       if (error.code === 'P2003') {
        return NextResponse.json({ message: "Produk tidak dapat dihapus karena terkait dengan order" }, { status: 409 });
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}