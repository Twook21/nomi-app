import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const adminProfile = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    return successResponse(adminProfile);
  } catch (error: any) {
    return errorResponse('Failed to fetch admin profile', 500, error.message);
  }
}

export async function PUT(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const { username, email, password } = await request.json();
    const dataToUpdate: any = {};

    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
        return errorResponse('No fields to update provided', 400);
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: user!.userId },
      data: dataToUpdate,
      select: { id: true, username: true, email: true, role: true },
    });

    return successResponse({ message: 'Profile updated successfully', user: updatedAdmin });
  } catch (error: any) {
    return errorResponse('Failed to update profile', 500, error.message);
  }
}