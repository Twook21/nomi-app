import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { id: userId } = params;

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        umkmOwner: {
          select: {
            id: true,
            umkmName: true,
            isVerified: true,
            umkmAddress: true,
          },
        },
      },
    });

    if (!targetUser) {
      return errorResponse('User not found', 404);
    }

    return successResponse(targetUser);

  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    return errorResponse('Failed to fetch user details', 500, error.message);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { id: userId } = params;

  try {
    const { username, email, phoneNumber, address, role, password } = await request.json();

    const dataToUpdate: any = {};
    if (username !== undefined) dataToUpdate.username = username;
    if (email !== undefined) dataToUpdate.email = email;
    if (phoneNumber !== undefined) dataToUpdate.phoneNumber = phoneNumber;
    if (address !== undefined) dataToUpdate.address = address;
    if (role !== undefined) {
      if (!['customer', 'umkm_owner', 'admin'].includes(role)) {
        return errorResponse('Invalid role provided', 400);
      }
      dataToUpdate.role = role;
    }
    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return errorResponse('No fields to update provided', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
        updatedAt: true,
      },
    });

    return successResponse({ message: 'User updated successfully', user: updatedUser });

  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    if (error.code === 'P2002') { // Unique constraint violation
      return errorResponse('Email or username already in use', 409);
    }
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404);
    }
    return errorResponse('Failed to update user', 500, error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const { id: userId } = params;

  try {
    // Pastikan admin tidak menghapus dirinya sendiri
    if (userId === user!.userId) {
      return errorResponse('Cannot delete your own admin account', 403);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse({ message: 'User deleted successfully' });

  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404);
    }
    return errorResponse('Failed to delete user', 500, error.message);
  }
}