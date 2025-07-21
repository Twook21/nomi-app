/*
================================================================================
File: src/store/auth.ts
Description: State management global untuk autentikasi menggunakan Zustand.
Ini akan menyimpan token dan data user.
================================================================================
*/
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Tipe data untuk user, bisa disesuaikan dengan data dari API Anda
export interface User { // diexport agar bisa digunakan di file lain
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: 'customer' | 'umkm_owner' | 'admin';
}

// Tipe data untuk state di dalam store
interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Membuat store dengan persist middleware
// Data akan disimpan di cookies agar tetap ada setelah refresh halaman
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: User | null) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // Nama item di storage (cookies)
      storage: createJSONStorage(() => ({
        // Gunakan Cookies.set dan Cookies.get untuk interaksi dengan cookie
        getItem: (name) => {
          const str = Cookies.get(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), { expires: 7, path: '/' }); // Simpan selama 7 hari
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      })),
    }
  )
);