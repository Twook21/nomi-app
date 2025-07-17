"use client";

import { useState, useEffect, useCallback } from "react";
import CategoryTable from "./components/CategoryTable";
import CategoryFormModal from "./components/CategoryFormModal";
import { Category } from "@prisma/client";

export type SafeCategory = Omit<Category, 'id'> & {
  id: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SafeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SafeCategory | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Gagal memuat data kategori");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category: SafeCategory | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = async () => {
    handleCloseModal();
    await fetchCategories(); 
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal menghapus kategori");
        }
        await fetchCategories();
      } catch (error) {
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Manajemen Kategori
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Tambah Kategori
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <CategoryTable
          categories={categories}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <CategoryFormModal
          category={selectedCategory}
          onClose={handleCloseModal}
          onSuccess={handleFormSubmit}
        />
      )}
    </div>
  );
}