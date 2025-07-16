import { cookies } from 'next/headers'; // <-- PASTIKAN IMPOR INI BENAR
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface JWTPayload extends jwt.JwtPayload {
  userId: string;
}

export async function getCurrentUser() {
  
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
    });

    if (!user) return null;

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;

  } catch (error) {
    console.error("Sesi tidak valid:", error);
    return null;
  }
}