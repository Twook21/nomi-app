"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok!");
      setIsLoading(false);
      return;
    }

    const result = await register(name, email, password);
    
    if (result.success) {
      setSuccess(result.message);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <main
      className="bg-[var(--nimo-gray)] min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundImage: "url(/images/bg-auth.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white dark:bg-[var(--background)] rounded-2xl shadow-2xl dark:shadow-none dark:border dark:border-gray-700 p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nimo-yellow">NOMI</h1>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--nimo-dark)]">
            Buat Akun Baru
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bergabunglah dengan kami dan mulai selamatkan makanan!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-[var(--nimo-dark)]"
            >
              Nama Lengkap
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                placeholder="Nama Anda"
                disabled={isLoading}
              />
            </div>
          </div>

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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                placeholder="anda@email.com"
                disabled={isLoading}
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
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-[var(--nimo-dark)]"
            >
              Konfirmasi Kata Sandi
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-10 p-3 bg-transparent border rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition ${
                  error && password !== confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-nimo-yellow hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nimo-yellow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sedang Mendaftar..." : "Daftar"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-nimo-yellow hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;