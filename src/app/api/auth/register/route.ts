// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, phoneNumber, address, role } = await request.json();

    // Validasi input dasar
    if (!username || !email || !password || !role) {
      return errorResponse('Missing required fields', 400);
    }

    // Periksa apakah email atau username sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return errorResponse('Email or username already registered', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        phoneNumber,
        address,
        role,
      },
    });

    // Jika role adalah UMKM owner, buat entri UMKMOwner juga
    if (role === 'umkm_owner') {
      await prisma.uMKMOwner.create({
        data: {
          userId: newUser.id,
          umkmName: `${username}'s UMKM`, // Nama UMKM awal, bisa diubah nanti
        },
      });
    }

    // Generate token JWT untuk langsung login
    const token = generateToken(newUser.id, newUser.role);

    return successResponse({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    }, 201);

  } catch (error: any) {
    console.error('Error registering user:', error);
    return errorResponse('Failed to register user', 500, error.message);
  }
}