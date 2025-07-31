import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, token, authMethod, setUser, setAuthMethod, loadUserProfile } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('useAuth initializing...', { 
        sessionStatus: status, 
        hasSession: !!session, 
        hasToken: !!token, 
        hasUser: !!user,
        authMethod 
      });

      // Handle NextAuth session
      if (status === "authenticated" && session?.user && authMethod !== 'nextauth') {
        console.log('Setting up NextAuth user');
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.name,
          image: session.user.image,
          username: session.user.username,
          role: session.user.role as any,
          umkmProfileStatus: session.user.umkmProfileStatus as any,
          address: null, // NextAuth biasanya tidak punya ini
          phoneNumber: null, // NextAuth biasanya tidak punya ini
        });
        setAuthMethod('nextauth');
        setIsInitialized(true);
        return;
      }

      // Handle JWT token case
      if (token && !user && authMethod !== 'nextauth') {
        console.log('Token found but no user, loading profile...');
        setAuthMethod('jwt');
        await loadUserProfile();
        setIsInitialized(true);
        return;
      }

      // Handle case where we have token and user
      if (token && user && authMethod === 'jwt') {
        console.log('JWT auth already initialized');
        setIsInitialized(true);
        return;
      }

      // No authentication
      if (status !== 'loading' && !token) {
        console.log('No authentication found');
        setIsInitialized(true);
        return;
      }

      // Session still loading
      if (status === 'loading') {
        console.log('Session still loading...');
        return;
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [session, status, token, user, authMethod, setUser, setAuthMethod, loadUserProfile]);

  // Return unified auth state
  const isAuthenticated = (status === "authenticated" && session) || (token && user);
  const currentUser = session?.user || user;
  const isLoading = status === "loading" || !isInitialized;

  console.log('useAuth returning:', {
    isAuthenticated,
    hasUser: !!currentUser,
    isLoading,
    authMethod,
    userId: currentUser?.id
  });

  return {
    user: currentUser,
    isAuthenticated,
    isLoading,
    authMethod,
    refreshUser: loadUserProfile, // Expose refresh function
  };
}