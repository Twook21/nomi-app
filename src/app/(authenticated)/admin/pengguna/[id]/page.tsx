import Link from "next/link";
import { notFound } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Hash,
  ArrowLeft,
} from "lucide-react";
import { mockUsers } from "@/lib/data";

type UserDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const userId = parseInt(params.id, 10);
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/pengguna"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Pengguna
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-nimo-yellow/20 rounded-full">
            <User className="h-8 w-8 text-nimo-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Peran</p>
              <span
                className={`px-2.5 py-1 text-sm font-medium rounded-full capitalize ${
                  user.role === "admin"
                    ? "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CalendarDays className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tanggal Bergabung
              </p>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 md:col-span-2">
            <Hash className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID Pengguna
              </p>
              <p className="text-base font-mono text-gray-700 dark:text-gray-200">
                {user.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
