import { FullOrderDetail } from "../page";

interface OrderDetailModalProps {
  order: FullOrderDetail;
  onClose: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detail Pesanan</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        {/* Info Pelanggan & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
                <h3 className="font-semibold text-lg mb-2">Pelanggan</h3>
                <p>{order.user.name}</p>
                <p>{order.user.email}</p>
                <p>{order.user.phoneNumber || 'No phone'}</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2">Info Pesanan</h3>
                <p><span className="font-semibold">ID Pesanan:</span> {order.orderCode}</p>
                <p><span className="font-semibold">Tanggal:</span> {new Date(order.orderDate).toLocaleString('id-ID')}</p>
                <p><span className="font-semibold">Status:</span> {order.status}</p>
                <p><span className="font-semibold">Metode Bayar:</span> {order.paymentMethod || '-'}</p>
            </div>
        </div>

        {/* Daftar Produk */}
        <h3 className="font-semibold text-lg mb-2">Item Dipesan</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-600 border-t border-b">
          {order.orderItems.map(item => (
            // ✅ PERBAIKAN: Gunakan `item.id` langsung sebagai key
            <div key={item.id} className="flex items-center py-4">
                <img src={item.product.imageUrl || 'https://via.placeholder.com/64'} alt={item.product.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                <div className="flex-grow">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="flex justify-end mt-6 text-xl font-bold">
            <span className="mr-4">Total:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}