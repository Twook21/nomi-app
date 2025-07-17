import { OrderStatus } from "@prisma/client";
import { SafeOrder } from "../page";

interface OrderTableProps {
  orders: SafeOrder[];
  onViewDetail: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDelete: (orderId: string) => void;
}

const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PAID: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

export default function OrderTable({ orders, onViewDetail, onUpdateStatus, onDelete }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Pelanggan</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tanggal</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 text-sm font-mono text-gray-500">{order.orderCode}</td>
              <td className="px-6 py-4 text-sm font-medium">{order.user.name}</td>
              <td className="px-6 py-4 text-sm">{new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
              <td className="px-6 py-4 text-sm">{formatCurrency(order.totalAmount)}</td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onViewDetail(order.id)} className="text-blue-600 hover:text-blue-800">Detail</button>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-sm rounded border-gray-300 dark:bg-gray-600 dark:border-gray-500"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}   