"use server"; 

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

/**
 * Menyetujui pendaftaran mitra.
 * @param partnerId - ID mitra yang akan disetujui (dalam bentuk string).
 */
export async function approvePartner(partnerId: string) {
  try {
    await prisma.partner.update({
      where: {
        id: BigInt(partnerId),
      },
      data: {
        status: 'APPROVED',
      },
    });

    
    revalidatePath('/admin/partners');
  } catch (error) {
    console.error("Failed to approve partner:", error);
    throw new Error("Gagal menyetujui mitra.");
  }
}

/**
 * Menolak pendaftaran mitra.
 * @param partnerId - ID mitra yang akan ditolak (dalam bentuk string).
 */
export async function rejectPartner(partnerId: string) {
  try {
    await prisma.partner.update({
      where: {
        id: BigInt(partnerId),
      },
      data: {
        status: 'REJECTED',
      },
    });

    revalidatePath('/admin/partners');
  } catch (error) {
    console.error("Failed to reject partner:", error);
    throw new Error("Gagal menolak mitra.");
  }
}
