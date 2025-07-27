import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { Cart } from '@/types/cart';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'umkm_owner' | 'admin';
  umkmProfileStatus: 'verified' | 'pending' | null;
  address: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  activeView: 'customer' | 'umkm';
  cartCount: number;
  isCartSummaryOpen: boolean;
  cartSummaryData: Cart | null;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  switchView: (view: 'customer' | 'umkm') => void;
  setCartCount: (count: number) => void;
  openCartSummary: (cart: Cart) => void;
  closeCartSummary: () => void;
  fetchCartCount: (token: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeView: 'customer',
      cartCount: 0,
      isCartSummaryOpen: false,
      cartSummaryData: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: User | null) => {
        set({ user, activeView: 'customer' });
      },
      switchView: (view) => set({ activeView: view }),
      setCartCount: (count) => set({ cartCount: count }),
      openCartSummary: (cart) => set({ isCartSummaryOpen: true, cartSummaryData: cart }),
      closeCartSummary: () => set({ isCartSummaryOpen: false }),
      fetchCartCount: async (token) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart?countOnly=true`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Failed to fetch cart count');
          const result = await response.json();
          set({ cartCount: result.data.itemCount });
        } catch (error) {
          set({ cartCount: 0 });
        }
      },
      logout: () => set({ token: null, user: null, activeView: 'customer', cartCount: 0 }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = Cookies.get(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), { expires: 7, path: "/" });
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      })),
    }
  )
);
