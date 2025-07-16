"use client"; 

import React from 'react';
import { approvePartner, rejectPartner } from '@/lib/action'; 
import { useTransition } from 'react';

type PartnerData = {
  id: string;
  storeName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
};

function ActionButton({ partnerId, action, label, className }: { partnerId: string, action: (id: string) => Promise<void>, label: string, className: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => action(partnerId))}
      disabled={isPending}
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait ${className}`}
    >
      {isPending ? '...' : label}
    </button>
  );
}


export default function PartnerTable({ partners }: { partners: PartnerData[] }) {
  const getStatusChip = (status: PartnerData['status']) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Disetujui</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Ditolak</span>;
      case 'PENDING':
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Menunggu</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Toko</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pemilik</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal Daftar</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{partner.storeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{partner.user.name} ({partner.user.email})</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(partner.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(partner.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {partner.status === 'PENDING' && (
                  <div className="flex items-center justify-end space-x-2">
                    <ActionButton partnerId={partner.id} action={approvePartner} label="Setujui" className="bg-green-500 hover:bg-green-600 text-white" />
                    <ActionButton partnerId={partner.id} action={rejectPartner} label="Tolak" className="bg-red-500 hover:bg-red-600 text-white" />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
