import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const serializableUsers = users.map(user => ({
      ...user,
      id: user.id.toString(),
    }));

    return NextResponse.json(serializableUsers);

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phoneNumber, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phoneNumber,
        role,
      },
    });

    const { passwordHash: _, ...result } = newUser;

    const serializableResult = {
      ...result,
      id: result.id.toString(),
    };

    return NextResponse.json(serializableResult, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}