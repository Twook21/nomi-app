import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return errorResponse("Email/username and password are required", 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: {
        umkmOwner: {
          select: { isVerified: true },
        },
      },
    });

    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = generateToken(user.id, user.role);

    // PERBAIKAN: Menentukan status profil UMKM yang lebih detail
    let umkmProfileStatus: "verified" | "pending" | null = null;
    if (user.umkmOwner) {
      umkmProfileStatus = user.umkmOwner.isVerified ? "verified" : "pending";
    }

    return successResponse({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        umkmProfileStatus, // <-- Mengirim status yang lebih jelas
      },
      token,
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    return errorResponse("Failed to login", 500, error.message);
  }
}
