import { ProductStatus } from "@prisma/client";
import { SafeProduct } from "../page";

interface ProductTableProps {
  products: SafeProduct[];
  onEdit: (product: SafeProduct) => void;
  onDelete: (id: string) => void;
}

// ✅ PASTIKAN ADA "export default"
export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getStatusBadge = (status: ProductStatus) => {
    const baseStyle = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'AVAILABLE':
        return <span className={`${baseStyle} bg-green-100 text-green-800`}>Tersedia</span>;
      case 'SOLD_OUT':
        return <span className={`${baseStyle} bg-red-100 text-red-800`}>Habis</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Produk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mitra</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stok</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            // ✅ PASTIKAN KEY MENGGUNAKAN ID YANG UNIK
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.partner.storeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex flex-col">
                    <span>{formatCurrency(product.discountedPrice)}</span>
                    <span className="line-through text-gray-400 text-xs">{formatCurrency(product.originalPrice)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(product.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onEdit(product)} className="px-3 py-1 text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600">Edit</button>
                  <button onClick={() => onDelete(product.id)} className="px-3 py-1 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600">Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}