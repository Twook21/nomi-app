"use client";

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    alert(`Mencoba login dengan Email: ${email}`);
  };

  return (
    <main
      className="bg-[var(--nimo-gray)] min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundImage: "url(/image/bg-auth.png)", 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white dark:bg-[var(--background)] rounded-2xl shadow-2xl dark:shadow-none dark:border dark:border-gray-700 p-8 space-y-6">
        {/* Header Form */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nimo-yellow">NIMO</h1>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--nimo-dark)]">
            Selamat Datang Kembali
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--nimo-dark)]"
            >
              Alamat Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                placeholder="anda@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--nimo-dark)]"
            >
              Kata Sandi
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-nimo-yellow hover:underline"
              >
                Lupa kata sandi?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-nimo-yellow hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nimo-yellow"
            >
              Masuk
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="font-medium text-nimo-yellow hover:underline"
          >
            Daftar sekarang
          </a>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
