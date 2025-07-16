import { getCurrentUser } from "@/lib/auth"; // Sesuaikan path jika perlu
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Profil Saya
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-2xl">
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              readOnly
              defaultValue={user.name}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              readOnly
              defaultValue={user.email}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nomor Telepon
            </label>
            <input
              type="text"
              id="phoneNumber"
              readOnly
              defaultValue={user.phoneNumber || "Tidak ada"}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              readOnly
              defaultValue={user.role}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
