import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// Helper untuk serialisasi BigInt
const serialize = (data: any) => JSON.parse(JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value)));

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(serialize(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 });
    }
    
    // Buat slug secara otomatis dari nama
    const slug = slugify(name, { lower: true, strict: true });

    // Cek duplikasi nama atau slug
    const existingCategory = await prisma.category.findFirst({
        where: { OR: [{name}, {slug}] }
    });

    if (existingCategory) {
        return NextResponse.json({ message: "Nama atau slug kategori sudah ada" }, { status: 409 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(serialize(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}