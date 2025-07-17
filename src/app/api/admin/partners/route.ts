import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const serialize = (data: any) => JSON.parse(JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value)));

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      select: {
        id: true,
        storeName: true,
      },
      orderBy: {
        storeName: 'asc',
      },
    });
    return NextResponse.json(serialize(partners));
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}