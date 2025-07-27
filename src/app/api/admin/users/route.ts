import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { authenticateAndAuthorize } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ["admin"]);
  if (response) return response;

  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const where: any = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalUsers = await prisma.user.count({ where });

    return successResponse({
      users,
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return errorResponse("Failed to fetch users", 500, error.message);
  }
}
