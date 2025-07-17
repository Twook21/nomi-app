"use client";

import { useState, useEffect, useCallback } from "react";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import { User } from "@prisma/client";

type SafeUser = Omit<User, "passwordHash">;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SafeUser | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Gagal memuat data");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user: SafeUser | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async () => {
    handleCloseModal();
    await fetchUsers();
  };

  const handleDelete = async (id: BigInt) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Gagal menghapus user");
        await fetchUsers();
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
        <h1 className="text-2xl font-bold">Manajemen User</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Tambah User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <UserTable
          users={users}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>
      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSuccess={handleFormSubmit}
        />
      )}
    </div>
  );
}
