import React from 'react';
import { prisma } from '@/lib/prisma';
import PartnerTable from './components/PartnerTable';

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });


  const serializedPartners = partners.map(partner => ({
    ...partner,
    id: partner.id.toString(),
    userId: partner.userId.toString(),
    user: partner.user
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manajemen Mitra</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <PartnerTable partners={serializedPartners} />
      </div>
    </div>
  );
}