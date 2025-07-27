import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['customer']);
  if (response) return response;

  try {
    const data = await request.json();

    if (!data.umkmName || !data.umkmEmail || !data.umkmPhoneNumber || !data.umkmAddress) {
      return errorResponse('Data UMKM yang wajib diisi tidak lengkap', 400);
    }

    // PERBAIKAN: Logika disederhanakan. Tidak ada lagi transaksi atau update peran.
    // Cukup buat profil UMKM baru yang belum terverifikasi.
    const newUmkmProfile = await prisma.uMKMOwner.create({
        data: {
          userId: user!.userId,
          umkmName: data.umkmName,
          umkmDescription: data.umkmDescription,
          umkmAddress: data.umkmAddress,
          umkmPhoneNumber: data.umkmPhoneNumber,
          umkmEmail: data.umkmEmail,
          bankName: data.bankName,
          bankAccountNumber: data.bankAccountNumber,
          isVerified: false, // <-- Status default adalah false
        },
      });

    return successResponse({ message: 'Pendaftaran UMKM berhasil! Mohon tunggu persetujuan dari admin.', umkm: newUmkmProfile }, 201);

  } catch (error: any) {
    if (error.code === 'P2002') {
      return errorResponse('Anda sudah terdaftar sebagai mitra UMKM.', 409);
    }
    console.error('Error creating UMKM profile:', error);
    return errorResponse('Gagal mendaftar sebagai UMKM', 500, error.message);
  }
}