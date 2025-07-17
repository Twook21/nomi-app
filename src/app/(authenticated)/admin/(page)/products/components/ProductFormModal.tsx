import { useState, useEffect } from "react";
import { Category, Partner, ProductStatus } from "@prisma/client";
import { SafeProduct } from "../page";

type SafePartner = Pick<Partner, 'id' | 'storeName'> & { id: string };
type SafeCategory = Pick<Category, 'id' | 'name'> & { id: string };

interface ProductFormModalProps {
  product: SafeProduct | null;
  partners: SafePartner[];
  categories: SafeCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

type ProductFormData = {
  name: string;
  description: string;
  partnerId: string;
  categoryId: string;
  originalPrice: string;
  discountedPrice: string;
  quantity: string;
  expirationDate: string;
  status: ProductStatus; 
  imageUrl: string;
};

const inputStyle = "w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

export default function ProductFormModal({ product, partners, categories, onClose, onSuccess }: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    partnerId: "",
    categoryId: "",
    originalPrice: "",
    discountedPrice: "",
    quantity: "",
    expirationDate: "",
    status: ProductStatus.AVAILABLE, 
    imageUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = product !== null;

  useEffect(() => {
    if (isEditMode && product) { 
      setFormData({
        name: product.name,
        description: product.description || "",
        partnerId: product.partnerId,
        categoryId: product.categoryId,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        quantity: String(product.quantity),
        expirationDate: new Date(product.expirationDate).toISOString().split('T')[0],
        status: product.status,
        imageUrl: product.imageUrl || ""
      });
    }
  }, [product, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFormData((prev) => ({ ...prev, status: value as ProductStatus }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = isEditMode ? `/api/admin/products/${product?.id}` : "/api/admin/products";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal ${isEditMode ? "mengupdate" : "membuat"} produk`);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(1px)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Produk */}
            <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
            </div>
            {/* Deskripsi */}
            <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className={inputStyle} rows={3}></textarea>
            </div>
            {/* URL Gambar */}
             <div>
                <label className="block text-sm font-medium mb-1">URL Gambar</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputStyle} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Partner & Kategori */}
                <div>
                    <label className="block text-sm font-medium mb-1">Mitra</label>
                    <select name="partnerId" value={formData.partnerId} onChange={handleChange} className={inputStyle} required>
                        <option value="">Pilih Mitra</option>
                        {partners.map(p => <option key={p.id} value={p.id}>{p.storeName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputStyle} required>
                        <option value="">Pilih Kategori</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                {/* Harga */}
                <div>
                    <label className="block text-sm font-medium mb-1">Harga Asli (Rp)</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={inputStyle} required />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Harga Diskon (Rp)</label>
                    <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className={inputStyle} required />
                </div>
                 {/* Kuantitas & Tanggal Kedaluwarsa */}
                 <div>
                    <label className="block text-sm font-medium mb-1">Kuantitas (Stok)</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={inputStyle} required />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Tgl. Kedaluwarsa</label>
                    <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className={inputStyle} required />
                </div>
            </div>
             {/* Status */}
            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                 <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                    {Object.values(ProductStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}