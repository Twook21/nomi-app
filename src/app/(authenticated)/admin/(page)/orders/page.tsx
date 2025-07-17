"use client";

import { useState, useEffect, useCallback } from "react";
import OrderTable from "./components/OrderTable";
import OrderDetailModal from "./components/OrderDetailModal";
import { Order, User, OrderStatus } from "@prisma/client"; // Import OrderStatus

// Tipe untuk daftar ringkas di tabel (sudah benar)
export type SafeOrder = Omit<Order, 'id' | 'userId' | 'totalAmount'> & {
  id: string;
  userId: string;
  totalAmount: number;
  user: { name: string; email: string };
  orderItems: { quantity: number; price: number }[];
};

// ✅ PERBAIKAN: Definisikan ulang tipe FullOrderDetail secara eksplisit
export type FullOrderDetail = Omit<Order, 'id' | 'userId' | 'totalAmount' | 'orderItems'> & {
    id: string;
    userId: string;
    totalAmount: number;
    user: User; // Menggunakan tipe User lengkap dari Prisma
    orderItems: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            imageUrl: string | null;
        }
    }[];
};


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SafeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<FullOrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Gagal memuat data pesanan");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetail = async (orderId: string) => {
    try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if(!response.ok) throw new Error("Gagal memuat detail");
        const data: FullOrderDetail = await response.json();
        setSelectedOrder(data);
        setIsModalOpen(true);
    } catch (error) {
        console.error(error);
    }
  };
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if(!response.ok) throw new Error("Gagal update status");
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat diurungkan.")) {
      try {
        const response = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Gagal menghapus pesanan");
        fetchOrders(); // Refresh data
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manajemen Pesanan</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <OrderTable
          orders={orders}
          onViewDetail={handleViewDetail}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}