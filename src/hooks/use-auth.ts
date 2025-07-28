import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, token, authMethod, setUser, setAuthMethod } = useAuthStore();

  useEffect(() => {
    // Sync NextAuth session with Zustand store
    if (status === "authenticated" && session?.user && authMethod !== 'nextauth') {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image,
        username: session.user.username,
        role: session.user.role as any,
        umkmProfileStatus: session.user.umkmProfileStatus as any,
      });
      setAuthMethod('nextauth');
    }
  }, [session, status, authMethod, setUser, setAuthMethod]);

  // Return unified auth state
  const isAuthenticated = (status === "authenticated" && session) || (token && user);
  const currentUser = session?.user || user;

  return {
    user: currentUser,
    isAuthenticated,
    isLoading: status === "loading",
    authMethod,
  };
}