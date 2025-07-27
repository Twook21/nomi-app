import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

// GET handler untuk mengambil detail satu pengguna
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { user, response } = await authenticateAndAuthorize(request, ['admin']);
    if (response) return response;

    try {
        const userDetail = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                username: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
                createdAt: true,
                umkmOwner: {
                    select: { id: true, umkmName: true, isVerified: true }
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    select: { 
                        id: true, 
                        totalAmount: true, 
                        orderStatus: true,
                        createdAt: true,
                        umkmOwner: { select: { umkmName: true } }
                    }
                }
            }
        });

        if (!userDetail) {
            return errorResponse('User not found', 404);
        }

        // Hitung statistik tambahan
        const stats = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            _count: { id: true },
            where: { customerId: params.id }
        });

        const result = {
            ...userDetail,
            stats: {
                totalSpending: stats._sum.totalAmount || 0,
                totalOrders: stats._count.id || 0,
            }
        };

        return successResponse(result);
    } catch (error: any) {
        return errorResponse('Failed to fetch user details', 500, error.message);
    }
}

// PUT handler untuk mengedit pengguna
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const userIdToUpdate = params.id;

  try {
    const { username, email, role } = await request.json();
    if (!username || !email || !role) {
        return errorResponse('Username, email, and role are required', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: { username, email, role },
    });

    return successResponse({ message: 'User updated successfully', user: updatedUser });
  } catch (error: any) {
    return errorResponse('Failed to update user', 500, error.message);
  }
}

// DELETE handler untuk menghapus pengguna
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  const userIdToDelete = params.id;

  if (userIdToDelete === user!.userId) {
    return errorResponse('Admin cannot delete their own account', 403);
  }

  try {
    await prisma.user.delete({
      where: { id: userIdToDelete },
    });

    return successResponse({ message: 'User deleted successfully' });
  } catch (error: any) {
    return errorResponse('Failed to delete user', 500, error.message);
  }
}

