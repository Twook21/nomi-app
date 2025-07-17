import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
import { Prisma } from '@prisma/client';

const serialize = (data: any) => JSON.parse(JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value)));

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = BigInt(params.id);
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 });
    }
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const existingCategory = await prisma.category.findFirst({
        where: { 
            OR: [{name}, {slug}],
            id: { not: categoryId }
        }
    });

    if (existingCategory) {
        return NextResponse.json({ message: "Nama atau slug sudah digunakan kategori lain" }, { status: 409 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug },
    });

    return NextResponse.json(serialize(updatedCategory));

  } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }
    console.error(`Error updating category ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Kategori berhasil dihapus" }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
      }
      if (error.code === 'P2003') { // Foreign key constraint
        return NextResponse.json({ message: "Kategori tidak dapat dihapus karena masih digunakan oleh produk." }, { status: 409 });
      }
    }
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}