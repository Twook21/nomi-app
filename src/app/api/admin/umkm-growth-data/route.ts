import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { authenticateAndAuthorize } from '@/lib/auth';
import { subMonths, startOfMonth, format } from 'date-fns';

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateAndAuthorize(request, ['admin']);
  if (response) return response;

  try {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

    const signups = await prisma.uMKMOwner.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
    });
    
    // Agregasi data per bulan
    const signupsByMonth: { [key: string]: number } = {};
    signups.forEach(signup => {
        const month = format(new Date(signup.createdAt), 'MMM yyyy');
        if (!signupsByMonth[month]) {
            signupsByMonth[month] = 0;
        }
        signupsByMonth[month] += signup._count.id;
    });

    const result = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        const month = format(date, 'MMM yyyy');
        return {
            month: format(date, 'MMM'),
            total: signupsByMonth[month] || 0,
        };
    }).reverse();

    return successResponse(result);
  } catch (error: any) {
    return errorResponse('Failed to fetch UMKM growth data', 500, error.message);
  }
}