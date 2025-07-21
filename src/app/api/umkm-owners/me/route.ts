import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    const umkmOwner = await prisma.uMKMOwner.findUnique({
      where: { userId: user!.userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });

    if (!umkmOwner) {
      return errorResponse('UMKM profile not found for this user', 404);
    }

    return successResponse(umkmOwner);

  } catch (error: any) {
    console.error('Error fetching UMKM owner profile:', error);
    return errorResponse('Failed to fetch UMKM owner profile', 500, error.message);
  }
}

export async function PUT(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['umkm_owner']);
  if (response) return response;

  try {
    const {
      umkmName,
      umkmDescription,
      umkmAddress,
      umkmPhoneNumber,
      umkmEmail,
      bankAccountNumber,
      bankName,
    } = await request.json();

    const dataToUpdate: any = {};
    if (umkmName !== undefined) dataToUpdate.umkmName = umkmName;
    if (umkmDescription !== undefined) dataToUpdate.umkmDescription = umkmDescription;
    if (umkmAddress !== undefined) dataToUpdate.umkmAddress = umkmAddress;
    if (umkmPhoneNumber !== undefined) dataToUpdate.umkmPhoneNumber = umkmPhoneNumber;
    if (umkmEmail !== undefined) dataToUpdate.umkmEmail = umkmEmail;
    if (bankAccountNumber !== undefined) dataToUpdate.bankAccountNumber = bankAccountNumber;
    if (bankName !== undefined) dataToUpdate.bankName = bankName;

    if (Object.keys(dataToUpdate).length === 0) {
      return errorResponse('No fields to update provided', 400);
    }

    const updatedUMKM = await prisma.uMKMOwner.update({
      where: { userId: user!.userId },
      data: dataToUpdate,
      select: {
        id: true,
        umkmName: true,
        umkmDescription: true,
        umkmAddress: true,
        umkmPhoneNumber: true,
        umkmEmail: true,
        bankAccountNumber: true,
        bankName: true,
        isVerified: true,
        updatedAt: true,
      },
    });

    return successResponse({ message: 'UMKM profile updated successfully', umkm: updatedUMKM });

  } catch (error: any) {
    console.error('Error updating UMKM owner profile:', error);
    return errorResponse('Failed to update UMKM owner profile', 500, error.message);
  }
}