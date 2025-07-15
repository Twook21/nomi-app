"use client";

import React, { useState } from "react";
import {
  Percent,
  Mail,
  MessageSquare,
  FileText,
  Save,
  Edit,
} from "lucide-react";

const SettingsPage = () => {
  const [commission, setCommission] = useState(15);
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Pengaturan Sistem
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Atur parameter, template notifikasi, dan konten statis platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">
              Manajemen Biaya Platform
            </h3>
            <div className="space-y-2">
              <label
                htmlFor="commission"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Persentase Komisi
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="commission"
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">
                  <Save size={18} />
                  <span>Simpan</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Biaya ini akan dikenakan pada setiap transaksi yang berhasil
                melalui platform.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">
              Pengaturan Notifikasi
            </h3>
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "email"
                      ? "border-nimo-yellow text-nimo-yellow"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Template Email
                </button>
                <button
                  onClick={() => setActiveTab("sms")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "sms"
                      ? "border-nimo-yellow text-nimo-yellow"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Template SMS
                </button>
              </nav>
            </div>
            <div className="mt-4">
              {activeTab === "email" && (
                <textarea
                  className="w-full h-40 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-nimo-yellow border-transparent"
                  defaultValue="Halo {nama_pengguna}, pesanan Anda #{nomor_pesanan} telah dikonfirmasi..."
                ></textarea>
              )}
              {activeTab === "sms" && (
                <textarea
                  className="w-full h-40 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-nimo-yellow border-transparent"
                  defaultValue="NOMI: Pesanan #{nomor_pesanan} dikonfirmasi. Terima kasih."
                ></textarea>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-fit">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">
            Manajemen Konten Statis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                FAQ
              </span>
              <button className="text-nimo-yellow hover:underline text-sm font-semibold">
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Kebijakan Privasi
              </span>
              <button className="text-nimo-yellow hover:underline text-sm font-semibold">
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Syarat & Ketentuan
              </span>
              <button className="text-nimo-yellow hover:underline text-sm font-semibold">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
