import { useState, useEffect } from "react";
import { User, Role } from "@prisma/client";

type SafeUser = Omit<User, "passwordHash">;

interface UserFormModalProps {
  user: SafeUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

type UserFormData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
};

const inputStyle =
  "w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export default function UserFormModal({
  user,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: Role.USER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = user !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber || "",
        role: user.role,
      });
    }
  }, [user, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = isEditMode ? `/api/admin/users/${user.id}` : "/api/admin/users";
    const method = isEditMode ? "PUT" : "POST";

    const body = { ...formData };
    if (isEditMode && !body.password) {
      delete (body as any).password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Gagal ${isEditMode ? "mengupdate" : "membuat"} user`);
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transition-transform transform scale-95 hover:scale-100">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {isEditMode ? "Edit User" : "Tambah User Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password{" "}
              <span className="text-gray-400">
                {isEditMode && "(Kosongkan jika tidak ingin diubah)"}
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
              required={!isEditMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              No. Telepon
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputStyle}
            >
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
