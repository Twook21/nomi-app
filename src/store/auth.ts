import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import type { Cart } from '@/types/cart';

export interface User {
  id: string;
  username?: string | null;
  email: string;
  name?: string | null;
  image?: string | null;
  role: 'customer' | 'umkm_owner' | 'admin';
  umkmProfileStatus: 'verified' | 'pending' | null;
  address?: string | null;
  phoneNumber?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  activeView: 'customer' | 'umkm';
  cartCount: number;
  isCartSummaryOpen: boolean;
  cartSummaryData: Cart | null;
  authMethod: 'jwt' | 'nextauth' | null;
  
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setAuthMethod: (method: 'jwt' | 'nextauth' | null) => void;
  switchView: (view: 'customer' | 'umkm') => void;
  setCartCount: (count: number) => void;
  openCartSummary: (cart: Cart) => void;
  closeCartSummary: () => void;
  fetchCartCount: (token: string) => Promise<void>;
  loadUserProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      activeView: 'customer',
      cartCount: 0,
      isCartSummaryOpen: false,
      cartSummaryData: null,
      authMethod: null,
      
      setToken: (token: string) => {
        console.log('Setting token in store:', !!token);
        set({ token });
        // Auto-load profile when token is set
        setTimeout(() => {
          get().loadUserProfile();
        }, 100);
      },
      
      setUser: (user: User | null) => {
        console.log('Setting user in store:', user);
        set({ user, activeView: 'customer' });
      },
      
      setAuthMethod: (method) => set({ authMethod: method }),
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
      
      loadUserProfile: async () => {
        const currentToken = get().token;
        console.log('loadUserProfile called, token:', !!currentToken);
        
        if (!currentToken) {
          console.log('No token, setting user to null');
          set({ user: null });
          return;
        }

        try {
          console.log('Fetching profile from API...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          const result = await response.json();
          console.log('Profile API response:', { status: response.status, result });

          if (response.ok) {
            // PENTING: Sesuaikan dengan struktur response API Anda
            // Dari kode API route.ts, response structure adalah langsung result (bukan result.data)
            const userData = result.id ? result : result.data; // Fallback jika wrapped dalam data
            
            const user: User = {
              id: userData.id,
              username: userData.username || null,
              email: userData.email,
              name: userData.name || null,
              image: userData.image || null,
              role: userData.role,
              umkmProfileStatus: userData.umkmOwner?.isVerified ? 'verified' : userData.umkmOwner ? 'pending' : null,
              address: userData.address || null,
              phoneNumber: userData.phoneNumber || null,
            };
            
            console.log('Setting loaded user:', user);
            set({ user, authMethod: 'jwt' });
          } else {
            console.error('Failed to load user profile:', result.message || 'Unknown error');
            if (response.status === 401) {
              get().logout(); // Logout jika token invalid
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Jangan logout pada network error, tapi set user ke null
          set({ user: null });
        }
      },
      
      logout: async () => {
        const { authMethod } = get();
        console.log('Logging out, auth method:', authMethod);
        
        if (authMethod === 'nextauth') {
          await nextAuthSignOut({ redirect: false });
        }
        
        set({ 
          token: null, 
          user: null, 
          activeView: 'customer', 
          cartCount: 0,
          authMethod: null 
        });
        Cookies.remove('auth-storage'); 
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = Cookies.get(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (e) {
            console.error("Failed to parse auth-storage from cookie:", e);
            return null;
          }
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), { expires: 7, path: "/" });
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      })),
      partialize: (state) => ({
        token: state.token,
        user: state.user ? {
          id: state.user.id,
          username: state.user.username,
          email: state.user.email,
          name: state.user.name,
          image: state.user.image,
          role: state.user.role,
          umkmProfileStatus: state.user.umkmProfileStatus,
          address: state.user.address,
          phoneNumber: state.user.phoneNumber,
        } : null,
        activeView: state.activeView,
        authMethod: state.authMethod,
      }),
      // Fix onRehydrateStorage - gunakan return function
      onRehydrateStorage: () => {
        return (state) => {
          console.log('Store rehydrated, token:', !!state?.token);
          if (state?.token && !state?.user) {
            console.log('Token found but no user, loading profile...');
            // Delay sedikit untuk memastikan store sudah ready
            setTimeout(() => {
              state.loadUserProfile();
            }, 100);
          }
        };
      }
    }
  )
);