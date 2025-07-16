import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = BigInt(params.id);
    const body = await request.json();
    const { name, email, password, phoneNumber, role } = body;

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: userId }, 
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: `Email '${email}' sudah digunakan oleh user lain.` },
          { status: 409 } 
        );
      }
    }

    const dataToUpdate: Prisma.UserUpdateInput = {
      name,
      email,
      phoneNumber,
      role,
    };

    
    if (password && password.trim() !== '') {
      dataToUpdate.passwordHash = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    
    const { passwordHash: _, ...result } = updatedUser;
    const serializableResult = {
      ...result,
      id: result.id.toString(),
    };

    return NextResponse.json(serializableResult);

  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: "User tidak ditemukan untuk dihapus" }, { status: 404 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ message: "User tidak dapat dihapus karena memiliki data terkait" }, { status: 409 });
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}