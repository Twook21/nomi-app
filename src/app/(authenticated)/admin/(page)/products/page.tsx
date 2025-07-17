"use client";

import { useState, useEffect, useCallback } from "react";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import { Product, Partner, Category } from "@prisma/client";

// Tipe data produk yang lebih aman untuk frontend
// Termasuk relasi yang di-include dari backend
export type SafeProduct = Omit<Product, 'id' | 'partnerId' | 'categoryId' | 'originalPrice' | 'discountedPrice'> & {
  id: string;
  partnerId: string;
  categoryId: string;
  originalPrice: string;
  discountedPrice: string;
  partner: { storeName: string };
  category: { name: string };
};

// Tipe sederhana untuk Partner dan Category yang akan di-fetch
type SafePartner = Pick<Partner, 'id' | 'storeName'> & { id: string };
type SafeCategory = Pick<Category, 'id' | 'name'> & { id: string };


export default function AdminProductsPage() {
  const [products, setProducts] = useState<SafeProduct[]>([]);
  const [partners, setPartners] = useState<SafePartner[]>([]);
  const [categories, setCategories] = useState<SafeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SafeProduct | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Ambil semua data yang diperlukan secara paralel
      const [productsRes, partnersRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/partners"), // Pastikan endpoint ini ada
        fetch("/api/admin/categories"), // Pastikan endpoint ini ada
      ]);

      if (!productsRes.ok || !partnersRes.ok || !categoriesRes.ok) {
        throw new Error("Gagal memuat data");
      }

      const productsData = await productsRes.json();
      const partnersData = await partnersRes.json();
      const categoriesData = await categoriesRes.json();
      
      setProducts(productsData);
      setPartners(partnersData);
      setCategories(categoriesData);

    } catch (error) {
      console.error(error);
      // Tambahkan notifikasi error untuk user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (product: SafeProduct | null = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async () => {
    handleCloseModal();
    await fetchData(); // Muat ulang data setelah submit
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Gagal menghapus produk");
        await fetchData(); // Muat ulang data
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Manajemen Produk
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Tambah Produk
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <ProductTable
          products={products}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          partners={partners}
          categories={categories}
          onClose={handleCloseModal}
          onSuccess={handleFormSubmit}
        />
      )}
    </div>
  );
}