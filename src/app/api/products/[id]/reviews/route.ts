// src/app/api/products/[id]/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
// Helper functions (assuming they are imported or defined elsewhere)
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// getUserAndAuthMethodFromRequest (assuming it's reusable)
async function getUserAndAuthMethodFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { user } = await (
        await import("@/lib/auth")
      ).authenticateAndAuthorize(request, ["customer", "umkm_owner"]);
      if (user) {
        return {
          userId: user.userId,
          method: "jwt" as const,
          userRole: user.role as "customer" | "umkm_owner" | "admin",
        };
      }
    }

    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          role: true,
        },
      });

      if (
        dbUser &&
        (dbUser.role === "customer" || dbUser.role === "umkm_owner")
      ) {
        return {
          userId: dbUser.id,
          method: "nextauth" as const,
          userRole: dbUser.role as "customer" | "umkm_owner" | "admin",
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Authentication error in reviews API:", error);
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } } // Gunakan nama berbeda untuk params awal
) {
  // Solusi: Await params
  const params = await rawParams;
  const { id: productId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse(
      "Forbidden",
      403,
      "Only customers or UMKM owners can add reviews."
    );
  }

  try {
    const { rating, comment } = await request.json();

    if (!productId) {
      return errorResponse("Product ID is missing from the URL.", 400);
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return errorResponse("Rating must be a number between 1 and 5", 400);
    }

    const hasPurchased = await prisma.order.count({
      where: {
        customerId: userId,
        orderStatus: "delivered",
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (hasPurchased === 0) {
      return errorResponse(
        "You can only review products you have purchased and received.",
        403
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        customerId: userId,
      },
    });

    if (existingReview) {
      return errorResponse(
        "You have already reviewed this product. Please edit your existing review.",
        409
      );
    }

    const newReview = await prisma.review.create({
      data: {
        productId: productId,
        customerId: userId,
        rating,
        comment,
      },
    });

    return successResponse(
      { message: "Review added successfully", review: newReview },
      201
    );
  } catch (error: any) {
    console.error(`Error adding review for product ${productId}:`, error); // Gunakan productId yang sudah di-await
    return errorResponse("Failed to add review", 500, error.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } } // Gunakan nama berbeda untuk params awal
) {
  // Solusi: Await params
  const params = await rawParams;
  const { id: productId } = params;

  const authResult = await getUserAndAuthMethodFromRequest(request);

  if (!authResult) {
    return errorResponse("Unauthorized", 401, "Authentication required.");
  }

  const { userId, userRole } = authResult;

  if (userRole !== "customer" && userRole !== "umkm_owner") {
    return errorResponse(
      "Forbidden",
      403,
      "Only customers or UMKM owners can edit reviews."
    );
  }

  try {
    const { rating, comment } = await request.json();

    if (!productId) {
      return errorResponse("Product ID is missing.", 400);
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return errorResponse("Rating must be a number between 1 and 5.", 400);
    }

    const updatedReview = await prisma.review.updateMany({
      where: {
        productId: productId,
        customerId: userId,
      },
      data: {
        rating,
        comment,
      },
    });

    if (updatedReview.count === 0) {
      return errorResponse(
        "Review not found or you do not have permission to edit it.",
        404
      );
    }

    return successResponse({ message: "Review updated successfully" });
  } catch (error: any) {
    console.error(`Error updating review for product ${productId}:`, error); // Gunakan productId yang sudah di-await
    return errorResponse("Failed to update review", 500, error.message);
  }
}

export async function GET(
  request: NextRequest,
  { params: rawParams }: { params: { id: string } }
) {
  // Solusi: Await params
  const params = await rawParams;
  const { id: productId } = params;

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        customer: {
          select: {
            username: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      // <--- PINDAHKAN ORDER BY KE SINI, DI LEVEL YANG SAMA DENGAN 'where' dan 'include'
      orderBy: { createdAt: "desc" },
    });

    return successResponse(reviews);
  } catch (error: any) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return errorResponse("Failed to fetch reviews", 500, error.message);
  }
}
