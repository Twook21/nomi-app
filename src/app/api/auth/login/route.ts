// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json(); // identifier bisa email atau username

    if (!identifier || !password) {
      return errorResponse('Email/username and password are required', 400);
    }

    // Cari user berdasarkan email atau username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generate token JWT
    const token = generateToken(user.id, user.role);

    return successResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error: any) {
    console.error('Error during login:', error);
    return errorResponse('Failed to login', 500, error.message);
  }
}